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
const selectedItem = ref<number | null>(null)
const placedItem = ref<number | null>(null)

const items = computed(() =>
  props.question.choices.map((choice) => ({ value: choice }))
)

function selectItem(value: number) {
  selectedItem.value = value
}

function placeInCompartment() {
  if (selectedItem.value !== null) {
    placedItem.value = selectedItem.value
    emit('answer', selectedItem.value)
    selectedItem.value = null
  }
}

function onDragStart(value: number) {
  selectedItem.value = value
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  placeInCompartment()
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onCompartmentKeydown(e: KeyboardEvent) {
  if ((e.key === 'Enter' || e.key === ' ') && selectedItem.value !== null) {
    e.preventDefault()
    placeInCompartment()
  }
}
</script>

<template>
  <div
    class="submarine-sort-scene"
    data-testid="minigame-submarine-sort"
    role="group"
    :aria-label="t('problemCard.ariaLabel', { a: question.a, b: question.b, answer: question.correctAnswer })"
  >
    <div class="items-row" role="group" aria-label="Items">
      <button
        v-for="item in items"
        :key="item.value"
        class="sort-item"
        :class="{ selected: selectedItem === item.value }"
        :aria-label="String(item.value)"
        :aria-pressed="selectedItem === item.value"
        draggable="true"
        @click="selectItem(item.value)"
        @dragstart="onDragStart(item.value)"
      >
        <span class="item-number">{{ item.value }}</span>
      </button>
    </div>

    <div
      class="compartment"
      :class="{ ready: selectedItem !== null }"
      role="button"
      tabindex="0"
      aria-label="Onderzeeër compartiment — klik om item te plaatsen"
      @drop="onDrop"
      @dragover="onDragOver"
      @click="placeInCompartment"
      @keydown="onCompartmentKeydown"
    >
      <span class="sub-emoji" aria-hidden="true">🚢</span>
      <span v-if="placedItem !== null" class="placed-badge">{{ placedItem }}</span>
      <span v-else class="drop-hint">⬇️</span>
    </div>
  </div>
</template>

<style scoped>
.submarine-sort-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  min-height: 260px;
}

.items-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.sort-item {
  width: 56px;
  height: 56px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 12px;
  border: 2px solid var(--app-primary, #42a5f5);
  background: linear-gradient(135deg, #bbdefb, #90caf9);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.sort-item:hover,
.sort-item:focus-visible {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.3);
}

.sort-item:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.sort-item.selected {
  border-color: var(--app-correct, #66bb6a);
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(102, 187, 106, 0.4);
}

.item-number {
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #0d47a1);
  pointer-events: none;
}

.compartment {
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

.compartment:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.compartment.ready {
  border-color: var(--app-correct, #66bb6a);
  background: rgba(102, 187, 106, 0.1);
}

.sub-emoji {
  font-size: 2rem;
}

.placed-badge {
  background: var(--app-correct, #66bb6a);
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  animation: slide-in 0.3s ease-out;
}

.drop-hint {
  font-size: 1.2rem;
}

@keyframes slide-in {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .sort-item,
  .compartment {
    transition: none;
  }
  .placed-badge {
    animation: none;
  }
}
</style>
