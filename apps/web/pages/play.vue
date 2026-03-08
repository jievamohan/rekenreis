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
import { computeStars } from '~/utils/starScoring'
import { useI18n } from '~/composables/useI18n'
import { nextTick, ref, watch } from 'vue'
import { useMinigame } from '~/composables/useMinigame'
import { useMinigameServing } from '~/composables/useMinigameServing'
import { useDifficultyProgression } from '~/composables/useDifficultyProgression'
import type { MinigameId } from '~/types/minigame'
import ProblemCard from '~/components/play/ProblemCard.vue'
import MinigameRenderer from '~/components/minigames/MinigameRenderer.vue'
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

const roundsPerLevel = computed(() =>
  currentMinigameId.value === 'memory-match' ? 5 : 10
)
const currentRoundDisplay = computed(() =>
  Math.min(roundsPerLevel.value, roundIndex.value + 1)
)
const completedProgressPercent = computed(() =>
  Math.min(100, (roundIndex.value / roundsPerLevel.value) * 100)
)
/** Node position aligned with fill so the current-round indicator sits at the leading edge. */
const currentRoundPercent = computed(() => completedProgressPercent.value)

const route = useRoute()
const router = useRouter()
const api = useApi()
const profile = useProfile()
const { telemetryOptOut } = useTelemetry(profile)
const { lastMode, lastSkin, setPreferences } = usePlayPreferences(profile)
const { setChooseGameHandler } = useAppShell()
const showModeSelector = ref(false)

const levelParam = computed(() => {
  const q = route.query.level as string | undefined
  return q ? Number(q) : null
})
const useKeypadMode = computed(() => levelParam.value !== null)
const useMinigameMode = computed(() => useKeypadMode.value)
const packSessionSeed = ref(0)
const initialPackIndex = computed(() => Math.max(0, (levelParam.value ?? 1) - 1))

const minigameTools = useMinigame()
const minigameServing = useMinigameServing({ noRepeatWindow: 2 })
const difficultyProg = useDifficultyProgression()
const currentMinigameId = ref<MinigameId | null>(null)
const currentMinigameParams = ref<Record<string, number>>({})
const gameMainRef = ref<HTMLElement | null>(null)
const minigameSessionSeed = ref(0)

const minigameQuestion = computed(() => {
  const q = game.question.value
  if (!q) return null
  return { a: q.a, b: q.b, correctAnswer: q.correctAnswer, choices: [...q.choices] }
})

function pickNextMinigame() {
  const level = levelParam.value ?? 1
  const entry = minigameTools.getMapEntry(level)
  const seed = minigameSessionSeed.value + level * 1000 + roundIndex.value
  const id = minigameServing.pick(entry, seed)
  const params = difficultyProg.getMinigameParams(id, level)
  if (id === 'memory-match') {
    const ceiling = mode.value === 'upTo10' ? 10 : 20
    const mathRange = difficultyProg.getMathRange(level, ceiling)
    params.operandMin = mathRange.operandMin
    params.operandMax = mathRange.operandMax
  }
  currentMinigameId.value = id
  currentMinigameParams.value = params
}

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
  playSource.value === 'pack'
    ? (() => {
        const pack = PACK_BY_MODE[interactionMode.value]
        if (!useKeypadMode.value || pack.length === 0) return pack
        const currentLevel = levelParam.value ?? 1
        const ceiling = mode.value === 'upTo10' ? 10 : 20
        const mathRange = difficultyProg.getMathRange(currentLevel, ceiling)
        const template = pack[(currentLevel - 1) % pack.length]!
        return [{
          ...template,
          operandMin: mathRange.operandMin,
          operandMax: mathRange.operandMax,
          choiceCount: mathRange.choiceCount,
        }]
      })()
    : []
)

const mode = ref<GameMode>(profile.activeProfile.value?.prefs.difficultyCeiling ?? 'upTo10')
watch(() => profile.activeProfile.value?.prefs.difficultyCeiling, (m) => {
  if (m) mode.value = m
}, { immediate: true })
const strugglingRoundsLeft = ref(0)
const game = usePlayGame(mode, {
  source: playSource,
  levelPack,
  initialPackIndex,
  packSeed: packSessionSeed,
  strugglingRoundsLeft,
})
const assistance = useAssistance(game.feedback, strugglingRoundsLeft)

const roundIndex = ref(0)
const correctCount = ref(0)
const { mistakes, record: recordMistake, clear: clearMistakes, count: mistakeCount, hasMistakes } = useMistakes()
const { completeLevel } = useLevelProgress(profile)
const showLevelComplete = ref(false)
const showReview = ref(false)
const completedStars = ref(0)
const totalLevels = levelsClassic.length

function onKeypadAnswer(answer: number) {
  if (game.feedback.value || !game.question.value) return
  const correct = answer === game.question.value.correctAnswer
  game.selectAnswer(answer, { silent: true })
  if (!correct) {
    recordMistake({
      a: game.question.value.a,
      b: game.question.value.b,
      correctAnswer: game.question.value.correctAnswer,
      selectedAnswer: answer,
    })
  }
  advanceRound(correct ? 'correct' : 'wrong')
}

function advanceRound(outcome?: 'correct' | 'wrong' | 'timeout') {
  const fb = game.feedback.value
  const resolved = outcome ?? (fb ? (isTimeoutFeedback(fb) ? 'timeout' : (isCorrectFeedback(fb) && fb.correct ? 'correct' : 'wrong')) : null)
  if (resolved) {
    if (resolved === 'correct') correctCount.value += 1
    roundOutcome.recordRoundOutcome(resolved, interactionMode.value)
    dailyGoal.incrementRound()
  }

  roundIndex.value += 1

  if (useKeypadMode.value && roundIndex.value >= roundsPerLevel.value) {
    const stars = computeStars(correctCount.value, roundsPerLevel.value)
    completeLevel(levelParam.value!, stars)
    completedStars.value = stars
    showLevelComplete.value = true
    sound.playCelebrate()
    return
  }

  game.nextQuestion()
  if (useMinigameMode.value) pickNextMinigame()
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
  correctCount.value = 0
  game.nextQuestion()
  if (useMinigameMode.value) pickNextMinigame()
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
  if (!fb || useKeypadMode.value) return
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

watch(
  () => useMinigameMode.value && currentMinigameId.value && minigameQuestion.value,
  (show) => {
    if (show) {
      nextTick(() => {
        setTimeout(() => {
          gameMainRef.value?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }, 150)
      })
    }
  },
  { immediate: true }
)

// immediate: true — pick minigame as soon as levelParam is ready (avoids race where
// onMounted ran before route was settled, causing levelParam=null → level 1 → wrong minigame)
watch(levelParam, (level, prevLevel) => {
  if (useMinigameMode.value) pickNextMinigame()
  // Reset session stats when navigating to a different level (e.g. Next → level+1)
  if (level !== null && prevLevel !== undefined && level !== prevLevel) {
    roundIndex.value = 0
    correctCount.value = 0
    clearMistakes()
  }
}, { immediate: true })

onMounted(() => {
  setChooseGameHandler(() => { showModeSelector.value = true })
  clearMistakes()
  roundIndex.value = 0
  correctCount.value = 0
  packSessionSeed.value = Math.floor(Math.random() * 1_000_000)
  minigameSessionSeed.value = Math.floor(Math.random() * 1_000_000)
  if (useMinigameMode.value) pickNextMinigame()
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

    <!-- Level complete: hide game so timer stops, modal overlays -->
    <template v-else-if="useKeypadMode && showLevelComplete">
      <div class="play-page-level-complete" aria-hidden="true" />
    </template>

    <!-- Minigame mode: ProblemCard + MinigameRenderer (never fall through to classic when level in URL) -->
    <template v-else-if="useKeypadMode">
      <div v-if="game.question.value" class="play-header play-header-minigame">
        <div class="progress-wrap">
          <div
            class="round-progress"
            role="progressbar"
            :aria-valuemin="0"
            :aria-valuemax="roundsPerLevel"
            :aria-valuenow="roundIndex"
            :aria-label="t('play.roundProgress')"
          >
            <div
              class="round-progress-fill"
              :style="{ width: `${completedProgressPercent}%` }"
            />
            <div
              class="round-progress-node round-progress-node-current"
              :style="{ left: `${currentRoundPercent}%` }"
              aria-hidden="true"
            >
              {{ currentRoundDisplay }}
            </div>
            <div class="round-progress-node round-progress-node-target" aria-hidden="true">
              {{ roundsPerLevel }}
            </div>
          </div>
        </div>
      </div>

      <div ref="gameMainRef" id="game-main" class="keypad-stage" tabindex="-1">
        <template v-if="game.question.value">
          <ProblemCard
            v-if="currentMinigameId !== 'memory-match'"
            :a="game.question.value.a"
            :b="game.question.value.b"
            :answer="''"
            :is-correct="null"
            variant="minigame"
          />

          <MinigameRenderer
            v-if="useMinigameMode && currentMinigameId && minigameQuestion"
            :key="roundIndex"
            :minigame-id="currentMinigameId"
            :question="minigameQuestion"
            :difficulty-params="currentMinigameParams"
            :timers-disabled="profile.activeProfile.value?.prefs.timersDisabled ?? false"
            @answer="onKeypadAnswer"
          />
        </template>
        <p v-else class="play-loading" role="status" aria-live="polite">
          {{ t('play.loading') }}
        </p>
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

  </div>
</template>

<style scoped>
.play-page {
  position: relative;
  padding: 0.5rem;
}

.exit-to-map-btn {
  position: relative;
  overflow: hidden;
  min-height: var(--app-tap-min);
  padding: 0.65rem 1.15rem;
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-bold);
  letter-spacing: 0.01em;
  color: #053344;
  background: linear-gradient(180deg, #8cf3ff 0%, #5ce2f5 55%, #37cbe5 100%);
  border: 2px solid rgba(5, 51, 68, 0.28);
  border-radius: 1rem;
  cursor: pointer;
  margin-bottom: var(--app-space-sm);
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  box-shadow:
    0 4px 0 rgba(5, 51, 68, 0.22),
    0 8px 14px rgba(4, 60, 82, 0.2);
  transition:
    transform 140ms ease,
    filter 140ms ease,
    box-shadow 140ms ease;
}

.exit-to-map-btn:hover {
  transform: translateY(-1px) scale(1.01);
  filter: saturate(1.05) brightness(1.02);
  box-shadow:
    0 5px 0 rgba(5, 51, 68, 0.2),
    0 12px 18px rgba(4, 60, 82, 0.24);
}

.exit-to-map-btn:active {
  transform: translateY(1px);
  box-shadow:
    0 2px 0 rgba(5, 51, 68, 0.2),
    0 6px 10px rgba(4, 60, 82, 0.18);
}

.exit-to-map-btn:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.95);
  outline-offset: 1px;
}

.play-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--app-space-sm);
  margin-bottom: 2.25rem;
}

.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  min-width: min(92vw, 440px);
}

.round-progress {
  position: relative;
  width: min(92vw, 440px);
  height: 1rem;
  background: #ffffff !important;
  border-radius: 999px;
  overflow: visible;
  border: 1px solid rgba(1, 36, 43, 0.22);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.9);
}

.round-progress-fill {
  height: calc(100% - 4px);
  margin: 2px;
  background: var(--app-primary);
  border-radius: 999px;
  transition: width 180ms ease-out;
}

.round-progress-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  background: #00bcd4;
  color: #01242b;
  font-family: var(--app-font);
  font-size: 0.82rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  border: 2px solid rgba(1, 36, 43, 0.22);
}

.round-progress-node-current {
  z-index: 2;
  background: linear-gradient(180deg, #41e3ff 0%, #00bcd4 100%);
  border-color: rgba(1, 36, 43, 0.28);
}

.round-progress-node-target {
  left: 100%;
  z-index: 1;
  background: linear-gradient(180deg, #ffffff 0%, #f3fbff 100%);
  color: rgba(1, 36, 43, 0.3);
  border-color: rgba(1, 36, 43, 0.24);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.12);
}

.play-header-minigame {
  margin-bottom: 1rem;
}

.keypad-stage {
  display: flex;
  flex-direction: column;
  gap: var(--app-space-md);
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding-top: 0.25rem;
}

.play-loading {
  margin: 2rem 0;
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  color: var(--app-muted);
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
