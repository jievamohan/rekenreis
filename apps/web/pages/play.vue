<script setup lang="ts">
import type { GameMode } from '~/types/game'
import type { Level } from '~/types/level'
import type { InteractionModeId } from '~/types/mode'
import type { SkinId } from '~/utils/skinResolver'
import { resolveSkinId } from '~/utils/skinResolver'
import { resolveInteractionMode } from '~/utils/modeResolver'
import { useApi } from '~/composables/useApi'
import { usePlayGame } from '~/composables/usePlayGame'
import { useRewards } from '~/composables/useRewards'
import { useSkin } from '~/composables/useSkin'
import { useMode } from '~/composables/useMode'
import { useTelemetry } from '~/composables/useTelemetry'
import { usePlayPreferences } from '~/composables/usePlayPreferences'
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
const { telemetryOptOut, setOptOut } = useTelemetry()
const { lastMode, lastSkin, setPreferences } = usePlayPreferences()
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

const mode = ref<GameMode>('upTo10')
const game = usePlayGame(mode, {
  source: playSource,
  levelPack,
})

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

const { isUnlocked, unlockedIds } = useRewards(game.score)
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
  onNext: game.nextQuestion,
  onModeChange: (m: GameMode) => {
    mode.value = m
  },
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
</script>

<template>
  <div class="play-page">
    <a href="#game-main" class="skip-link">Skip to game</a>
    <nav class="play-nav" role="navigation" aria-label="Game options">
      <button
        type="button"
        class="choose-game-btn"
        aria-label="Choose game mode"
        @click="showModeSelector = true"
      >
        Choose game
      </button>
    </nav>
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
    <div id="game-main" tabindex="-1">
      <component :is="gameMode.component" v-bind="modeProps" />
    </div>
    <footer class="privacy-footer">
      <p class="privacy-note">
        Anonymous gameplay stats may be shared to improve the game. No personal data is collected.
      </p>
      <label class="opt-out">
        <input
          type="checkbox"
          :checked="telemetryOptOut"
          aria-label="Opt out of anonymous stats"
          @change="setOptOut(($event.target as HTMLInputElement).checked)"
        />
        Opt out of anonymous stats
      </label>
    </footer>
  </div>
</template>

<style scoped>
.play-page {
  position: relative;
  padding: 0.5rem;
}
.play-nav {
  margin-bottom: 0.5rem;
}
.choose-game-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 2px solid #06c;
  border-radius: 0.5rem;
  background: #e6f2ff;
  cursor: pointer;
}
.choose-game-btn:hover {
  background: #cce5ff;
}
.choose-game-btn:focus-visible {
  outline: 2px solid #06c;
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
  padding: 0.35rem 0.75rem;
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
