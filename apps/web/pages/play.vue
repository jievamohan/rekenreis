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
import levelsClassic from '~/content/levels.classic.v1.json'
import levelsTimedPop from '~/content/levels.timed-pop.v1.json'
import levelsBuildBridge from '~/content/levels.build-bridge.v1.json'

const PACK_BY_MODE: Record<InteractionModeId, Level[]> = {
  classic: applyPacing(levelsClassic as Level[], 42),
  'timed-pop': applyPacing(levelsTimedPop as Level[], 42),
  'build-bridge': applyPacing(levelsBuildBridge as Level[], 42),
}

const MODE_OPTIONS: { id: InteractionModeId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'timed-pop', label: 'Timed Pop' },
  { id: 'build-bridge', label: 'Build Bridge' },
]

const route = useRoute()
const router = useRouter()
const api = useApi()
const profile = useProfile()
const { telemetryOptOut, setOptOut } = useTelemetry(profile)
const { lastMode, lastSkin, setPreferences } = usePlayPreferences(profile)
const { setChooseGameHandler } = useAppShell()
const showModeSelector = ref(false)

const playSource = computed(() =>
  route.query.source === 'pack' || route.query.mode === 'pack' ? 'pack' : 'infinite'
)

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
    <a href="#game-main" class="skip-link">Skip to game</a>
    <PlayModeSelector
      v-model="showModeSelector"
      :current-mode="interactionMode"
      :current-skin="effectiveSkinId"
      :is-unlocked="isUnlocked"
      :mode-options="MODE_OPTIONS"
      @select="onModeSelectorSelect"
    />
    <nav class="skin-picker" role="navigation" aria-label="Skin selector">
      <button
        v-for="id in SKIN_ORDER"
        :key="id"
        type="button"
        class="skin-btn"
        :class="{ active: skin.id === id, locked: !isUnlocked(id) }"
        :disabled="!isUnlocked(id)"
        :aria-label="isUnlocked(id) ? `Switch to ${id} skin` : `${id} locked (score ${UNLOCK_THRESHOLDS[id]} to unlock)`"
        :title="isUnlocked(id) ? id : `Score ${UNLOCK_THRESHOLDS[id]} to unlock`"
        @click="selectSkin(id)"
      >
        <span class="skin-label">{{ id }}</span>
        <span v-if="!isUnlocked(id)" class="lock" aria-hidden="true">🔒</span>
      </button>
    </nav>
    <StatPill
      v-if="profile.activeProfile.value"
      label="Rounds today"
      :value="`${dailyGoal.roundsPlayed}/${dailyGoal.goalRounds}`"
    />
    <div id="game-main" tabindex="-1">
      <component :is="gameMode.component" v-bind="modeProps" />
    </div>
    <footer class="privacy-footer">
      <p class="privacy-note">
        We may use anonymous play stats to improve the game. No personal data is collected.
      </p>
      <label class="opt-out">
        <input
          type="checkbox"
          :checked="telemetryOptOut"
          aria-label="Don't share anonymous stats"
          @change="setOptOut(($event.target as HTMLInputElement).checked)"
        />
        Don't share anonymous stats
      </label>
    </footer>
  </div>
</template>

<style scoped>
.play-page {
  position: relative;
  padding: 0.5rem;
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
  border: 1px solid #999;
  border-radius: 0.375rem;
  background: #fff;
  cursor: pointer;
}
.skin-btn:hover:not(:disabled) {
  background: #f0f0f0;
}
.skin-btn:focus-visible {
  outline: 2px solid #06c;
  outline-offset: 2px;
}
.skin-btn.active {
  border-color: #06c;
  background: #e6f2ff;
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
  color: #666;
  border-top: 1px solid #eee;
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
  outline: 2px solid #06c;
  outline-offset: 2px;
}
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0.5rem;
  z-index: 100;
  padding: 0.5rem 1rem;
  background: #06c;
  color: #fff;
  text-decoration: none;
  border-radius: 0.25rem;
}
.skip-link:focus {
  left: 0.5rem;
}
</style>
