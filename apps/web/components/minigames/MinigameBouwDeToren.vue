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
const progressText = computed(() =>
  t('minigameBouwDeToren.progress', {
    round: engine.currentRoundIndex.value + 1,
    total: engine.totalRounds,
    tower: engine.currentTowerIndex.value + 1,
    towersPerRound: engine.towersPerRound,
  })
)

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
      <div class="progress" aria-live="polite">
        {{ progressText }}
      </div>
      <TowerPuzzle
        :key="`${engine.currentRoundIndex}-${engine.currentTowerIndex}`"
        :puzzle="currentPuzzle"
        @correct="onCorrect"
        @wrong="onWrong"
      />
    </div>
    <div v-else-if="phase === 'roundComplete'" class="round-complete">
      <p>{{ t('minigameBouwDeToren.roundComplete') }}</p>
      <button class="cta" @click="onNextRound">
        {{ t('minigameBouwDeToren.nextRound') }}
      </button>
    </div>
    <div v-else-if="phase === 'levelComplete'" class="level-complete">
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

.progress {
  font-size: 0.9rem;
  color: var(--app-text-secondary, #666);
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
