<script setup lang="ts">
import type { GameMode } from '~/types/game'
import type { Level } from '~/types/level'
import type { SkinId } from '~/utils/skinResolver'
import { resolveSkinId } from '~/utils/skinResolver'
import { useApi } from '~/composables/useApi'
import { usePlayGame } from '~/composables/usePlayGame'
import { useRewards } from '~/composables/useRewards'
import { useSkin } from '~/composables/useSkin'
import { useTelemetry } from '~/composables/useTelemetry'
import { SKIN_ORDER, UNLOCK_THRESHOLDS } from '~/utils/rewardsConfig'
import levelsV1 from '~/content/levels.v1.json'

const route = useRoute()
const router = useRouter()
const api = useApi()
const { telemetryOptOut, setOptOut } = useTelemetry()
const playSource = computed(() =>
  route.query.mode === 'pack' ? 'pack' : 'infinite'
)
const levelPack = computed(() =>
  playSource.value === 'pack' ? (levelsV1 as Level[]) : []
)

const mode = ref<GameMode>('upTo10')
const game = usePlayGame(mode, {
  source: playSource.value,
  levelPack: levelPack.value,
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

function selectSkin(id: SkinId) {
  if (isUnlocked(id)) {
    router.push({ query: { ...route.query, skin: id } })
  }
}
</script>

<template>
  <div class="play-page">
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
    <component :is="skin.component" v-bind="skinProps" />
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
</style>
