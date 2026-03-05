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

const selectedGem = ref<number | null>(null)
const draggedGem = ref<number | null>(null)

const gems = computed(() => {
  return props.question.choices.map((choice) => ({
    value: choice,
  }))
})

function selectGem(value: number) {
  selectedGem.value = value
}

function dropOnChest() {
  if (selectedGem.value !== null) {
    emit('answer', selectedGem.value)
    selectedGem.value = null
  }
}

function onDragStart(value: number) {
  draggedGem.value = value
  selectedGem.value = value
}

function onDragEnd() {
  draggedGem.value = null
}

function onDrop() {
  if (draggedGem.value !== null) {
    emit('answer', draggedGem.value)
    draggedGem.value = null
    selectedGem.value = null
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onKeySelect(value: number) {
  selectedGem.value = value
}

function onChestKeydown(e: KeyboardEvent) {
  if ((e.key === 'Enter' || e.key === ' ') && selectedGem.value !== null) {
    e.preventDefault()
    emit('answer', selectedGem.value)
    selectedGem.value = null
  }
}
</script>

<template>
  <div
    class="treasure-dive-scene"
    data-testid="minigame-treasure-dive"
    role="group"
    :aria-label="t('problemCard.ariaLabel', { a: question.a, b: question.b, answer: question.correctAnswer })"
  >
    <div class="gems-row" role="group" aria-label="Keuzes">
      <button
        v-for="gem in gems"
        :key="gem.value"
        class="gem"
        :class="{ selected: selectedGem === gem.value, dragging: draggedGem === gem.value }"
        :aria-label="String(gem.value)"
        :aria-pressed="selectedGem === gem.value"
        draggable="true"
        @click="onKeySelect(gem.value)"
        @dragstart="onDragStart(gem.value)"
        @dragend="onDragEnd"
      >
        <span class="gem-number">{{ gem.value }}</span>
      </button>
    </div>

    <div
      class="chest-zone"
      :class="{ 'chest-ready': selectedGem !== null }"
      role="button"
      tabindex="0"
      aria-label="Schatkist — sleep of klik om antwoord te geven"
      @drop.prevent="onDrop"
      @dragover="onDragOver"
      @click="dropOnChest"
      @keydown="onChestKeydown"
    >
      <div class="chest-icon" aria-hidden="true">🏴‍☠️</div>
      <span class="chest-label">
        {{ selectedGem !== null ? `${selectedGem} → 📦` : '📦' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.treasure-dive-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  min-height: 260px;
}

.gems-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.gem {
  width: 56px;
  height: 56px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 12px;
  border: 2px solid var(--app-secondary, #ab47bc);
  background: linear-gradient(135deg, #e1bee7, #ce93d8);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.gem:hover,
.gem:focus-visible {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(171, 71, 188, 0.3);
}

.gem:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.gem.selected {
  border-color: var(--app-correct, #66bb6a);
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(102, 187, 106, 0.4);
}

.gem.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.gem-number {
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #4a148c);
  pointer-events: none;
}

.chest-zone {
  width: 120px;
  height: 80px;
  border: 3px dashed var(--app-muted, #90a4ae);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.chest-zone:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.chest-zone.chest-ready {
  border-color: var(--app-correct, #66bb6a);
  background: rgba(102, 187, 106, 0.1);
}

.chest-icon {
  font-size: 2rem;
}

.chest-label {
  font-family: var(--app-font, sans-serif);
  font-size: 0.85rem;
  color: var(--app-text-muted, #546e7a);
}

@media (prefers-reduced-motion: reduce) {
  .gem,
  .chest-zone {
    transition: none;
  }
}
</style>
