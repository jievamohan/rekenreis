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
const placedPiece = ref<number | null>(null)

const pieces = computed(() =>
  props.question.choices.map((choice) => ({
    value: choice,
  }))
)

function selectPiece(value: number) {
  placedPiece.value = value
  emit('answer', value)
}
</script>

<template>
  <div
    class="coral-builder-scene"
    data-testid="minigame-coral-builder"
    role="group"
    :aria-label="t('problemCard.ariaLabel', { a: question.a, b: question.b, answer: question.correctAnswer })"
  >
    <div class="reef-area" aria-hidden="true">
      <span class="reef-emoji">🪸</span>
      <span v-if="placedPiece !== null" class="placed-piece">{{ placedPiece }}</span>
    </div>

    <div class="pieces-row" role="group" aria-label="Koraalstukken">
      <button
        v-for="piece in pieces"
        :key="piece.value"
        class="coral-piece"
        :aria-label="String(piece.value)"
        @click="selectPiece(piece.value)"
      >
        <span class="piece-number">{{ piece.value }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.coral-builder-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  min-height: 260px;
}

.reef-area {
  position: relative;
  font-size: 3rem;
  padding: 1rem;
}

.placed-piece {
  position: absolute;
  top: 0;
  right: -8px;
  background: var(--app-correct, #66bb6a);
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  animation: piece-place 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pieces-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.coral-piece {
  width: 56px;
  height: 56px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 8px;
  border: 2px solid #ff8a65;
  background: linear-gradient(135deg, #ffe0b2, #ffcc80);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.coral-piece:hover,
.coral-piece:focus-visible {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(255, 138, 101, 0.3);
}

.coral-piece:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.piece-number {
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: #bf360c;
  pointer-events: none;
}

@keyframes piece-place {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .placed-piece {
    animation: none;
  }
  .coral-piece {
    transition: none;
  }
}
</style>
