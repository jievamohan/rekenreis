<script setup lang="ts">
import type { GameMode } from '~/types/game'
import type { Level } from '~/types/level'
import type { InteractionModeId } from '~/types/mode'
import type { SkinId } from '~/utils/skinResolver'
import { resolveSkinId } from '~/utils/skinResolver'
import { resolveInteractionMode } from '~/utils/modeResolver'
import { useApi } from '~/composables/useApi'
import { usePlayGame } from '~/composables/usePlayGame'
import { useAssistance } from '~/composables/useAssistance'
import { useRewards } from '~/composables/useRewards'
import { useSkin } from '~/composables/useSkin'
import { useMode } from '~/composables/useMode'
import { useTelemetry } from '~/composables/useTelemetry'
import { usePlayPreferences } from '~/composables/usePlayPreferences'
import { useProfile } from '~/composables/useProfile'
import { useSound } from '~/composables/useSound'
import { useDailyGoal } from '~/composables/useDailyGoal'
import { useRoundOutcome } from '~/composables/useRoundOutcome'
import { isCorrectFeedback, isTimeoutFeedback } from '~/utils/feedbackHelpers'
import { useAppShell } from '~/composables/useAppShell'
import { SKIN_ORDER, UNLOCK_THRESHOLDS } from '~/utils/rewardsConfig'
import { applyPacing } from '~/utils/pacingEngine'
import { useLevelProgress } from '~/composables/useLevelProgress'
import { useMistakes } from '~/composables/useMistakes'
import { useI18n } from '~/composables/useI18n'
import ProblemCard from '~/components/play/ProblemCard.vue'
import Keypad from '~/components/play/Keypad.vue'
import LevelCompleteModal from '~/components/modals/LevelCompleteModal.vue'
import MistakesReview from '~/components/review/MistakesReview.vue'
import levelsClassic from '~/content/levels.classic.v1.json'
import levelsTimedPop from '~/content/levels.timed-pop.v1.json'
import levelsBuildBridge from '~/content/levels.build-bridge.v1.json'

const PACK_BY_MODE: Record<InteractionModeId, Level[]> = {
  classic: applyPacing(levelsClassic as Level[], 42),
  'timed-pop': applyPacing(levelsTimedPop as Level[], 42),
  'build-bridge': applyPacing(levelsBuildBridge as Level[], 42),
}

const { t } = useI18n()
const MODE_OPTIONS = computed(() => [
  { id: 'classic' as const, label: t('modes.classic') },
  { id: 'timed-pop' as const, label: t('modes.timedPop') },
  { id: 'build-bridge' as const, label: t('modes.buildBridge') },
])

const ROUNDS_PER_LEVEL = 5

const route = useRoute()
const router = useRouter()
const api = useApi()
const profile = useProfile()
const { telemetryOptOut, setOptOut } = useTelemetry(profile)
const { lastMode, lastSkin, setPreferences } = usePlayPreferences(profile)
const { setChooseGameHandler } = useAppShell()
const showModeSelector = ref(false)

const levelParam = computed(() => {
  const q = route.query.level as string | undefined
  return q ? Number(q) : null
})
const useKeypadMode = computed(() => levelParam.value !== null)

const playSource = computed(() => {
  if (useKeypadMode.value) return 'pack' as const
  return (route.query.source === 'pack' || route.query.mode === 'pack' ? 'pack' : 'infinite') as 'pack' | 'infinite'
})

const effectiveModeParam = computed(() => {
  const q = route.query.mode as string | undefined
  if (q && q !== 'pack') return q
  return lastMode.value
})

const interactionMode = computed(() =>
  resolveInteractionMode(effectiveModeParam.value)
)
const gameMode = computed(() => useMode(interactionMode.value))
const levelPack = computed(() =>
  playSource.value === 'pack' ? PACK_BY_MODE[interactionMode.value] : []
)

const mode = ref<GameMode>(profile.activeProfile.value?.prefs.difficultyCeiling ?? 'upTo10')
watch(() => profile.activeProfile.value?.prefs.difficultyCeiling, (m) => {
  if (m) mode.value = m
}, { immediate: true })
const strugglingRoundsLeft = ref(0)
const game = usePlayGame(mode, {
  source: playSource,
  levelPack,
  strugglingRoundsLeft,
})
const assistance = useAssistance(game.feedback, strugglingRoundsLeft)

const keypadRef = ref<InstanceType<typeof Keypad> | null>(null)
const roundIndex = ref(0)
const { mistakes, record: recordMistake, clear: clearMistakes, count: mistakeCount, hasMistakes } = useMistakes()
const { completeLevel } = useLevelProgress(profile)
const showLevelComplete = ref(false)
const showReview = ref(false)
const completedStars = ref(0)
const totalLevels = levelsClassic.length

const feedbackResult = computed<boolean | null>(() => {
  const fb = game.feedback.value
  if (!fb) return null
  if (isCorrectFeedback(fb)) return fb.correct
  return false
})

function onKeypadAnswer(answer: number) {
  game.selectAnswer(answer)
  if (game.question.value && answer !== game.question.value.correctAnswer) {
    recordMistake({
      a: game.question.value.a,
      b: game.question.value.b,
      correctAnswer: game.question.value.correctAnswer,
      selectedAnswer: answer,
    })
  }
}

function advanceRound() {
  const fb = game.feedback.value
  if (fb) {
    const outcome = isTimeoutFeedback(fb) ? 'timeout' : (isCorrectFeedback(fb) && fb.correct ? 'correct' : 'wrong')
    roundOutcome.recordRoundOutcome(outcome, interactionMode.value)
    dailyGoal.incrementRound()
  }

  roundIndex.value += 1

  if (useKeypadMode.value && roundIndex.value >= ROUNDS_PER_LEVEL) {
    const stars = mistakeCount.value === 0 ? 3 : mistakeCount.value <= 1 ? 2 : 1
    completeLevel(levelParam.value!, stars)
    completedStars.value = stars
    showLevelComplete.value = true
    sound.playCelebrate()
    return
  }

  game.nextQuestion()
  keypadRef.value?.clear()
}

function onModalBackToMap() {
  showLevelComplete.value = false
  router.push('/map')
}

function onModalNext() {
  showLevelComplete.value = false
  const lvl = levelParam.value!
  if (lvl >= totalLevels) {
    router.push('/map')
  } else {
    router.push({ path: '/play', query: { level: String(lvl + 1) } })
  }
}

function onModalReviewMistakes() {
  showLevelComplete.value = false
  showReview.value = true
}

function onRetryLevel() {
  showReview.value = false
  clearMistakes()
  roundIndex.value = 0
  game.nextQuestion()
  keypadRef.value?.clear()
}

function onBackToMap() {
  showReview.value = false
  router.push('/map')
}

function onModalClose() {
  showLevelComplete.value = false
}

const sessionStatsSent = ref(false)
watch(
  () => game.score.value,
  (score) => {
    if (
      !telemetryOptOut.value &&
      !sessionStatsSent.value &&
      score >= 1
    ) {
      sessionStatsSent.value = true
      api.postSessionStats({ score }).catch(() => {})
    }
  },
  { immediate: true }
)

const { isUnlocked, unlockedIds } = useRewards(game.score, profile)
const sound = useSound(profile)
const dailyGoal = useDailyGoal(profile)
const roundOutcome = useRoundOutcome(profile)

const prevGoalReached = ref(false)
watch(dailyGoal.isGoalReached, (reached) => {
  if (reached && !prevGoalReached.value) sound.playCelebrate()
  prevGoalReached.value = reached
}, { immediate: true })

watch(game.feedback, (fb) => {
  if (!fb) return
  if ('correct' in fb) {
    if (fb.correct) sound.playCorrect()
    else sound.playWrong()
  }
})

const prevUnlockedCount = ref(-1)
watch(unlockedIds, (ids) => {
  const n = ids.length
  if (prevUnlockedCount.value >= 0 && n > prevUnlockedCount.value) {
    sound.playCelebrate()
  }
  prevUnlockedCount.value = n
}, { immediate: true })
const effectiveSkinId = computed(() => {
  const resolved = resolveSkinId(route.query.skin as string | undefined)
  return isUnlocked(resolved) ? resolved : (unlockedIds.value[0] ?? 'classic')
})
const skin = computed(() => useSkin(effectiveSkinId.value))

const skinProps = computed(() => ({
  question: game.question.value,
  feedback: game.feedback.value,
  score: game.score.value,
  streak: game.streak.value,
  mode: mode.value,
  onAnswer: game.selectAnswer,
  onNext: () => {
    const fb = game.feedback.value
    if (fb) {
      const outcome = isTimeoutFeedback(fb) ? 'timeout' : (isCorrectFeedback(fb) && fb.correct ? 'correct' : 'wrong')
      roundOutcome.recordRoundOutcome(outcome, interactionMode.value)
      dailyGoal.incrementRound()
    }
    game.nextQuestion()
  },
  onModeChange: (m: GameMode) => {
    mode.value = m
  },
  hintToShow: (profile.activeProfile.value?.prefs.hintsOn !== false) ? assistance.hintToShow.value : null,
  hintQuestion: game.question.value
    ? {
        a: game.question.value!.a,
        b: game.question.value!.b,
        correctAnswer: game.question.value!.correctAnswer,
      }
    : null,
}))

const modeProps = computed(() => ({
  ...skinProps.value,
  effectiveSkinId: effectiveSkinId.value,
  recordTimeout: game.recordTimeout,
}))

function selectSkin(id: SkinId) {
  if (isUnlocked(id)) {
    router.push({ query: { ...route.query, skin: id } })
  }
}

function onModeSelectorSelect(mode: InteractionModeId, skin: SkinId) {
  setPreferences(mode, skin)
  router.push({
    query: {
      ...route.query,
      mode: mode === 'classic' ? undefined : mode,
      skin: skin === 'classic' ? undefined : skin,
    },
  })
}

onMounted(() => {
  setChooseGameHandler(() => { showModeSelector.value = true })
  clearMistakes()
  roundIndex.value = 0
  const qm = route.query.mode as string | undefined
  if (!qm || qm === 'pack') {
    const needsSync = lastMode.value !== 'classic' || lastSkin.value !== 'classic'
    if (needsSync) {
      router.replace({
        query: {
          ...route.query,
          mode: lastMode.value === 'classic' ? undefined : lastMode.value,
          skin: lastSkin.value === 'classic' ? undefined : lastSkin.value,
        },
      })
    }
  }
})

onUnmounted(() => {
  setChooseGameHandler(null)
})
</script>

<template>
  <div class="play-page">
    <a href="#game-main" class="skip-link">{{ t('play.skipToGame') }}</a>

    <button
      v-if="!showLevelComplete && !showReview"
      type="button"
      class="exit-to-map-btn"
      :aria-label="t('play.exitToMap')"
      @click="onBackToMap"
    >
      {{ t('common.backToMap') }}
    </button>

    <!-- Mistakes review -->
    <template v-if="useKeypadMode && showReview">
      <MistakesReview
        :mistakes="[...mistakes]"
        :level="levelParam ?? 1"
        @retry="onRetryLevel"
        @back-to-map="onBackToMap"
      />
    </template>

    <!-- Keypad mode: ProblemCard + Keypad -->
    <template v-else-if="useKeypadMode && game.question.value">
      <div class="play-header">
        <StatPill :label="t('play.score')" :value="game.score.value" />
        <span class="progress-indicator" role="status" :aria-label="t('play.roundProgress')">
          {{ roundIndex + 1 }} / {{ ROUNDS_PER_LEVEL }}
        </span>
        <StatPill :label="t('play.streak')" :value="game.streak.value" />
      </div>

      <div id="game-main" class="keypad-stage" tabindex="-1">
        <ProblemCard
          :a="game.question.value.a"
          :b="game.question.value.b"
          :answer="keypadRef?.input ?? ''"
          :is-correct="feedbackResult"
        />

        <div
          v-if="game.feedback.value"
          class="keypad-feedback"
          :class="feedbackResult ? 'feedback-correct' : 'feedback-wrong'"
          role="status"
          aria-live="polite"
        >
          <p v-if="feedbackResult">{{ t('play.correct') }}</p>
          <p v-else>
            {{ t('play.wrong', { answer: game.question.value.correctAnswer }) }}
          </p>
          <button type="button" class="next-btn" @click="advanceRound">
            {{ roundIndex + 1 >= ROUNDS_PER_LEVEL ? t('common.finish') : t('common.next') }}
          </button>
        </div>

        <Keypad
          v-show="!game.feedback.value"
          ref="keypadRef"
          :disabled="!!game.feedback.value"
          @answer="onKeypadAnswer"
        />
      </div>
    </template>

    <!-- Classic mode: existing skin system -->
    <template v-else>
      <PlayModeSelector
        v-model="showModeSelector"
        :current-mode="interactionMode"
        :current-skin="effectiveSkinId"
        :is-unlocked="isUnlocked"
        :mode-options="MODE_OPTIONS"
        @select="onModeSelectorSelect"
      />
      <nav class="skin-picker" role="navigation" :aria-label="t('play.skinSelector')">
        <button
          v-for="id in SKIN_ORDER"
          :key="id"
          type="button"
          class="skin-btn"
          :class="{ active: skin.id === id, locked: !isUnlocked(id) }"
          :disabled="!isUnlocked(id)"
          :aria-label="isUnlocked(id) ? t('play.switchSkin', { id }) : t('play.skinLocked', { id, threshold: UNLOCK_THRESHOLDS[id] })"
          :title="isUnlocked(id) ? id : t('play.scoreToUnlock', { threshold: UNLOCK_THRESHOLDS[id] })"
          @click="selectSkin(id)"
        >
          <span class="skin-label">{{ id }}</span>
          <span v-if="!isUnlocked(id)" class="lock" aria-hidden="true">🔒</span>
        </button>
      </nav>
      <StatPill
        v-if="profile.activeProfile.value"
        :label="t('play.roundsToday')"
        :value="`${dailyGoal.roundsPlayed}/${dailyGoal.goalRounds}`"
      />
      <div id="game-main" tabindex="-1">
        <component :is="gameMode.component" v-bind="modeProps" />
      </div>
    </template>

    <LevelCompleteModal
      v-if="useKeypadMode"
      :open="showLevelComplete"
      :level="levelParam ?? 1"
      :stars="completedStars"
      :has-mistakes="hasMistakes"
      :is-last-level="(levelParam ?? 1) >= totalLevels"
      @back-to-map="onModalBackToMap"
      @next="onModalNext"
      @review-mistakes="onModalReviewMistakes"
      @close="onModalClose"
    />

    <footer class="privacy-footer">
      <p class="privacy-note">
        {{ t('privacy.statsNote') }}
      </p>
      <label class="opt-out">
        <input
          type="checkbox"
          :checked="telemetryOptOut"
          :aria-label="t('privacy.optOut')"
          @change="setOptOut(($event.target as HTMLInputElement).checked)"
        />
        {{ t('privacy.optOut') }}
      </label>
    </footer>
  </div>
</template>

<style scoped>
.play-page {
  position: relative;
  padding: 0.5rem;
}

.exit-to-map-btn {
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-md);
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-primary);
  background: var(--app-surface);
  border: 2px solid var(--app-primary);
  border-radius: var(--app-radius-md);
  cursor: pointer;
  margin-bottom: var(--app-space-sm);
  transition: background var(--app-transition);
}

.exit-to-map-btn:hover {
  background: rgba(0, 188, 212, 0.15);
}

.exit-to-map-btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.play-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-space-sm);
  margin-bottom: var(--app-space-md);
}

.progress-indicator {
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
}

.keypad-stage {
  display: flex;
  flex-direction: column;
  gap: var(--app-space-lg);
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
}

.keypad-feedback {
  text-align: center;
  padding: var(--app-space-md);
  border-radius: var(--app-radius-md);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
}

.feedback-correct {
  color: var(--app-correct);
}

.feedback-wrong {
  color: var(--app-wrong);
}

.next-btn {
  margin-top: var(--app-space-sm);
  min-height: var(--app-tap-min);
  min-width: 120px;
  padding: var(--app-space-sm) var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  background: var(--app-primary);
  border: none;
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: background var(--app-transition);
}

.next-btn:hover {
  background: var(--app-primary-hover);
}

.next-btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.skin-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  justify-content: center;
}
.skin-btn {
  padding: 0.5rem 0.75rem;
  min-height: 44px;
  min-width: 44px;
  font-size: 0.85rem;
  border: 1px solid var(--app-muted);
  border-radius: 0.375rem;
  background: var(--app-surface);
  cursor: pointer;
}
.skin-btn:hover:not(:disabled) {
  background: var(--app-surface-elevated);
}
.skin-btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
.skin-btn.active {
  border-color: var(--app-primary);
  background: rgba(0, 188, 212, 0.15);
}
.skin-btn.locked {
  cursor: not-allowed;
  opacity: 0.6;
}
.skin-btn .lock {
  margin-left: 0.25rem;
}
.privacy-footer {
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 0.8rem;
  color: var(--app-text-muted);
  border-top: 1px solid var(--app-muted);
}
.privacy-note {
  margin: 0 0 0.5rem;
}
.opt-out {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.opt-out input:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0.5rem;
  z-index: 100;
  padding: 0.5rem 1rem;
  background: var(--app-primary);
  color: var(--app-text);
  text-decoration: none;
  border-radius: 0.25rem;
}
.skip-link:focus,
.skip-link:focus-visible {
  left: 0.5rem;
}
</style>
