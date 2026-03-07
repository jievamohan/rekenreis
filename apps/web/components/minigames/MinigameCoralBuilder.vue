<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const { t } = useI18n()
const selectedPosition = ref<number | null>(null)
const placed = ref(false)

const maxValue = computed(() => {
  const choices = props.question.choices
  return Math.max(...choices, props.question.correctAnswer) + 2
})

const trackPositions = computed(() => {
  const positions: number[] = []
  for (let i = 0; i <= maxValue.value; i++) {
    positions.push(i)
  }
  return positions
})

const isChoice = computed(() => {
  const choiceSet = new Set(props.question.choices)
  return (pos: number) => choiceSet.has(pos)
})

function selectPosition(pos: number) {
  if (placed.value) return
  if (!isChoice.value(pos)) return
  selectedPosition.value = pos
  placed.value = true
  emit('answer', pos)
}

function onPositionKeydown(pos: number, e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    selectPosition(pos)
  }
}
</script>

<template>
  <div
    class="coral-sequence-scene"
    data-testid="minigame-coral-builder"
    role="group"
    :aria-label="t('minigameCoralBuilder.ariaLabel')"
  >
    <div class="reef-header" aria-hidden="true">
      <span class="reef-icon">🪸</span>
    </div>

    <p class="sequence-instruction">
      {{ t('minigameCoralBuilder.sequenceHint') }}
    </p>

    <div class="number-track" role="group" :aria-label="t('minigameCoralBuilder.trackLabel')">
      <div
        v-for="pos in trackPositions"
        :key="pos"
        class="track-position"
        :class="{
          'is-choice': isChoice(pos),
          'is-selected': selectedPosition === pos,
        }"
        :role="isChoice(pos) ? 'button' : 'presentation'"
        :tabindex="isChoice(pos) ? 0 : -1"
        :aria-label="isChoice(pos) ? t('minigameCoralBuilder.pieceLabel', { value: pos }) : undefined"
        @click="selectPosition(pos)"
        @keydown="onPositionKeydown(pos, $event)"
      >
        <span class="track-marker" :class="{ 'marker-choice': isChoice(pos) }">
          {{ isChoice(pos) ? pos : '·' }}
        </span>
        <span class="track-number">{{ pos }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coral-sequence-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  min-height: 260px;
}

.reef-header {
  font-size: 2.5rem;
}

.sequence-instruction {
  font-family: var(--app-font, sans-serif);
  font-size: 0.9rem;
  color: var(--app-text-muted, #b0bec5);
  margin: 0;
  text-align: center;
}

.number-track {
  display: flex;
  gap: 0;
  align-items: flex-end;
  overflow-x: auto;
  padding: 0.5rem;
  max-width: 100%;
  scroll-snap-type: x mandatory;
}

.track-position {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 32px;
  padding: 0.25rem;
  scroll-snap-align: center;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.track-position.is-choice {
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
}

.track-position.is-choice:hover,
.track-position.is-choice:focus-visible {
  background: rgba(255, 138, 101, 0.15);
}

.track-position.is-choice:focus-visible {
  outline: 3px solid var(--app-primary, #4fc3f7);
  outline-offset: 2px;
}

.track-position.is-selected {
  background: rgba(102, 187, 106, 0.2);
}

.track-marker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--app-font, sans-serif);
  font-size: 0.7rem;
  color: var(--app-text-muted, #546e7a);
  background: var(--app-surface, #e0f2f1);
  border: 2px solid transparent;
}

.track-marker.marker-choice {
  width: 40px;
  height: 40px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #bf360c;
  background: linear-gradient(135deg, #ffe0b2, #ffcc80);
  border: 2px solid #ff8a65;
  cursor: pointer;
}

.is-selected .track-marker.marker-choice {
  background: var(--app-correct, #66bb6a);
  border-color: var(--app-correct, #66bb6a);
  color: #fff;
  animation: coral-place 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.track-number {
  font-family: var(--app-font, sans-serif);
  font-size: 0.65rem;
  color: var(--app-text-muted, #90a4ae);
}

@keyframes coral-place {
  0% { transform: scale(0.5); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .track-position {
    transition: none;
  }
  .is-selected .track-marker.marker-choice {
    animation: none;
  }
}
</style>
