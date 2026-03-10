<script setup lang="ts">
import { watch, computed, onBeforeUnmount } from 'vue'
import { useTowerLevelEngine } from '~/composables/useTowerLevelEngine'
import TowerPuzzle from '~/components/minigames/bouw-de-toren/TowerPuzzle.vue'
import type { TowerLevelConfig } from '~/types/tower'
import { useI18n } from '~/composables/useI18n'

const ROUND_COMPLETE_DELAY_MS = 5000

const props = defineProps<{
  levelConfig: TowerLevelConfig
  seed?: number
}>()

const emit = defineEmits<{
  levelComplete: [payload: { stars: number; correctRounds: number; totalRounds: number }]
}>()

const { t } = useI18n()
const seed = props.seed ?? Date.now()

const engine = useTowerLevelEngine(props.levelConfig, seed)

const phase = computed(() => engine.phase.value)
const currentPuzzle = computed(() => engine.currentPuzzle.value)
const stars = computed(() => engine.stars.value)
const currentRoundIndex = computed(() => engine.currentRoundIndex.value)

let roundCompleteTimeout: ReturnType<typeof setTimeout> | null = null

watch(
  () => engine.phase.value,
  (p) => {
    if (p === 'levelComplete') {
      emit('levelComplete', {
        stars: engine.stars.value,
        correctRounds: engine.correctRounds.value,
        totalRounds: engine.totalRounds,
      })
    } else if (p === 'roundComplete') {
      roundCompleteTimeout = setTimeout(() => {
        roundCompleteTimeout = null
        engine.goToNextRound()
      }, ROUND_COMPLETE_DELAY_MS)
    }
  }
)

onBeforeUnmount(() => {
  if (roundCompleteTimeout) clearTimeout(roundCompleteTimeout)
})

function onCorrect() {
  engine.recordCorrect()
}

function onWrong() {
  engine.recordWrong()
}

function onNextPuzzle() {
  if (roundCompleteTimeout) {
    clearTimeout(roundCompleteTimeout)
    roundCompleteTimeout = null
  }
  engine.goToNextRound()
}

</script>

<template>
  <div
    class="bouw-de-toren"
    data-testid="minigame-bouw-de-toren"
    role="group"
    :aria-label="t('minigameBouwDeToren.ariaLabel')"
  >
    <div v-if="(phase === 'playing' || phase === 'roundComplete') && currentPuzzle" class="tower-scene">
      <TowerPuzzle
        :key="currentRoundIndex"
        :puzzle="currentPuzzle"
        :total-rounds="engine.totalRounds"
        :current-round-index="currentRoundIndex"
        :frozen="phase === 'roundComplete'"
        :round-complete="phase === 'roundComplete'"
        @correct="onCorrect"
        @wrong="onWrong"
      />
      <button
        v-if="phase === 'roundComplete'"
        type="button"
        class="cta cta-next"
        data-testid="tower-next-puzzle"
        :style="{ '--countdown-duration': `${ROUND_COMPLETE_DELAY_MS}ms` }"
        @click="onNextPuzzle"
      >
        <span class="cta-label">{{ t('minigameBouwDeToren.nextRound') }}</span>
        <span class="cta-countdown" aria-hidden="true" />
      </button>
    </div>
    <div v-else-if="phase === 'levelComplete'" class="level-complete">
      <div class="progress-stars" role="img" :aria-label="t('minigameBouwDeToren.starsAria', { stars })">
        <svg
          v-for="i in 3"
          :key="i"
          class="star-slot"
          :class="{ filled: i <= stars }"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
        </svg>
      </div>
      <p>{{ t('minigameBouwDeToren.levelComplete', { stars }) }}</p>
    </div>
  </div>
</template>

<style scoped>
.bouw-de-toren {
  width: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.tower-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.progress-stars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 18px;
}

.progress-stars .star-slot {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: rgba(255, 193, 7, 0.4);
  stroke-width: 1.5;
}

.progress-stars .star-slot.filled {
  fill: #ffc107;
  stroke: none;
}

.level-complete {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cta {
  position: relative;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  background: var(--app-primary, #4fc3f7);
  color: var(--app-on-primary, #fff);
  border: none;
  cursor: pointer;
  min-height: 44px;
  overflow: hidden;
}

.cta:hover,
.cta:focus-visible {
  opacity: 0.95;
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 2px;
}

.cta-label {
  position: relative;
  z-index: 1;
}

.cta-countdown {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.15);
}

.cta-countdown::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  animation: cta-countdown linear forwards;
  animation-duration: var(--countdown-duration, 5s);
  transform-origin: right center;
}

@keyframes cta-countdown {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

</style>
