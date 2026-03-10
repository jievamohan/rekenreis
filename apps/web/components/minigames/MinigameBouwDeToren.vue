<script setup lang="ts">
import { watch, computed } from 'vue'
import { useTowerLevelEngine } from '~/composables/useTowerLevelEngine'
import TowerPuzzle from '~/components/minigames/bouw-de-toren/TowerPuzzle.vue'
import type { TowerLevelConfig } from '~/types/tower'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  levelConfig: TowerLevelConfig
  seed?: number
}>()

const emit = defineEmits<{
  levelComplete: [payload: { stars: number }]
}>()

const { t } = useI18n()
const seed = props.seed ?? Date.now()

const engine = useTowerLevelEngine(props.levelConfig, seed)

const phase = computed(() => engine.phase.value)
const currentPuzzle = computed(() => engine.currentPuzzle.value)
const stars = computed(() => engine.stars.value)
const roundProgressPercent = computed(() =>
  engine.totalRounds > 0
    ? (engine.currentRoundIndex.value / engine.totalRounds) * 100
    : 0
)

const currentRoundDisplay = computed(() => engine.currentRoundIndex.value + 1)

const currentTowerIndex = computed(() => engine.currentTowerIndex.value)

watch(
  () => engine.phase.value,
  (phase) => {
    if (phase === 'levelComplete') {
      emit('levelComplete', { stars: engine.stars.value })
    }
  }
)

function onCorrect() {
  engine.recordCorrect()
}

function onWrong() {
  engine.recordWrong()
}

function onNextRound() {
  engine.goToNextRound()
}

function onDismissPhase() {
  engine.dismissPhase()
}
</script>

<template>
  <div
    class="bouw-de-toren"
    data-testid="minigame-bouw-de-toren"
    role="group"
    :aria-label="t('minigameBouwDeToren.ariaLabel')"
  >
    <Teleport to="body">
      <div
        v-if="phase === 'hint'"
        class="tower-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hint-title"
        data-testid="tower-hint-modal"
      >
        <div class="tower-modal">
          <h2 id="hint-title" class="tower-modal-title">
            {{ t('minigameBouwDeToren.hint') }}
          </h2>
          <button class="cta" @click="onDismissPhase">
            {{ t('minigameBouwDeToren.continue') }}
          </button>
        </div>
      </div>
      <div
        v-else-if="phase === 'lastChance' && currentPuzzle"
        class="tower-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lastchance-title"
        data-testid="tower-lastchance-modal"
      >
        <div class="tower-modal">
          <h2 id="lastchance-title" class="tower-modal-title">
            {{ t('minigameBouwDeToren.lastChance', { target: currentPuzzle.target }) }}
          </h2>
          <button class="cta" @click="onDismissPhase">
            {{ t('minigameBouwDeToren.continue') }}
          </button>
        </div>
      </div>
    </Teleport>
    <div v-if="phase === 'playing' && currentPuzzle" class="tower-scene">
      <div class="progress-wrap">
        <div
          class="round-progress"
          role="progressbar"
          :aria-valuemin="0"
          :aria-valuemax="engine.totalRounds"
          :aria-valuenow="currentRoundDisplay"
          :aria-label="t('play.roundProgress')"
        >
          <div
            class="round-progress-fill"
            :style="{ width: `${roundProgressPercent}%` }"
          />
          <div
            class="round-progress-node round-progress-node-current"
            :style="{ left: `${roundProgressPercent}%` }"
            aria-hidden="true"
          >
            {{ currentRoundDisplay }}
          </div>
          <div class="round-progress-node round-progress-node-target" aria-hidden="true">
            {{ engine.totalRounds }}
          </div>
        </div>
      </div>
      <TowerPuzzle
        :key="`${engine.currentRoundIndex}-${engine.currentTowerIndex}`"
        :puzzle="currentPuzzle"
        :towers-per-round="engine.towersPerRound"
        :current-tower-index="currentTowerIndex"
        @correct="onCorrect"
        @wrong="onWrong"
      />
    </div>
    <div v-else-if="phase === 'roundComplete'" class="round-complete">
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
      <p>{{ t('minigameBouwDeToren.roundComplete') }}</p>
      <button class="cta" @click="onNextRound">
        {{ t('minigameBouwDeToren.nextRound') }}
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

.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  min-width: min(92vw, 440px);
  margin-bottom: 0.5rem;
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

.round-complete,
.level-complete {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cta {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  background: var(--app-primary, #4fc3f7);
  color: var(--app-on-primary, #fff);
  border: none;
  cursor: pointer;
  min-height: 44px;
}

.cta:hover,
.cta:focus-visible {
  opacity: 0.95;
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 2px;
}

.tower-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.tower-modal {
  background: var(--app-surface, #f5f5f5);
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.tower-modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--app-text, #1a1a2e);
}
</style>
