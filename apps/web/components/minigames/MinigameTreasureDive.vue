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

const draggedGem = ref<number | null>(null)
const isDragging = ref(false)
const dragPos = ref({ x: 0, y: 0 })
const selectedGem = ref<number | null>(null)
const chestHighlight = ref(false)

const gems = computed(() =>
  props.question.choices.map((choice) => ({ value: choice }))
)

function onPointerDown(value: number, e: PointerEvent) {
  draggedGem.value = value
  selectedGem.value = value
  isDragging.value = true
  dragPos.value = { x: e.clientX, y: e.clientY }
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  dragPos.value = { x: e.clientX, y: e.clientY }
  const chestEl = document.querySelector('[data-drop-target="chest"]')
  if (chestEl) {
    const rect = chestEl.getBoundingClientRect()
    const inZone =
      e.clientX >= rect.left - 20 &&
      e.clientX <= rect.right + 20 &&
      e.clientY >= rect.top - 20 &&
      e.clientY <= rect.bottom + 20
    chestHighlight.value = inZone
  }
}

function onPointerUp(e: PointerEvent) {
  if (!isDragging.value || draggedGem.value === null) return
  const chestEl = document.querySelector('[data-drop-target="chest"]')
  if (chestEl) {
    const rect = chestEl.getBoundingClientRect()
    const inZone =
      e.clientX >= rect.left - 20 &&
      e.clientX <= rect.right + 20 &&
      e.clientY >= rect.top - 20 &&
      e.clientY <= rect.bottom + 20
    if (inZone) {
      emit('answer', draggedGem.value)
    }
  }
  isDragging.value = false
  draggedGem.value = null
  chestHighlight.value = false
}

function onGemKeydown(value: number) {
  selectedGem.value = value
}

function onChestKeydown(e: KeyboardEvent) {
  if ((e.key === 'Enter' || e.key === ' ') && selectedGem.value !== null) {
    e.preventDefault()
    emit('answer', selectedGem.value)
    selectedGem.value = null
  }
}

function onChestClick() {
  if (selectedGem.value !== null) {
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
    :aria-label="t('minigameTreasureDive.ariaLabel')"
  >
    <div class="source-zone" role="group" :aria-label="t('minigameTreasureDive.gemLabel', { value: '' })">
      <button
        v-for="gem in gems"
        :key="gem.value"
        class="gem"
        :class="{
          selected: selectedGem === gem.value,
          dragging: isDragging && draggedGem === gem.value,
        }"
        :aria-label="t('minigameTreasureDive.gemLabel', { value: gem.value })"
        :aria-pressed="selectedGem === gem.value"
        @pointerdown="onPointerDown(gem.value, $event)"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @click="onGemKeydown(gem.value)"
        @keydown.enter.prevent="onGemKeydown(gem.value)"
        @keydown.space.prevent="onGemKeydown(gem.value)"
      >
        <span class="gem-number">{{ gem.value }}</span>
      </button>
    </div>

    <div class="drop-arrow" aria-hidden="true">↓</div>

    <div
      class="chest-zone"
      :class="{ 'chest-highlight': chestHighlight || selectedGem !== null }"
      data-drop-target="chest"
      role="button"
      tabindex="0"
      :aria-label="t('minigameTreasureDive.chestReady')"
      @click="onChestClick"
      @keydown="onChestKeydown"
    >
      <div class="chest-icon" aria-hidden="true">🏴‍☠️</div>
      <span class="chest-label">
        {{ selectedGem !== null ? t('minigameTreasureDive.chestReady') : t('minigameTreasureDive.chestLabel') }}
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
  gap: 1rem;
  padding: 1rem;
  min-height: 280px;
  touch-action: none;
}

.source-zone {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0.75rem;
  border: 2px dashed var(--app-muted, #90a4ae);
  border-radius: 16px;
  background: rgba(171, 71, 188, 0.05);
  min-height: 80px;
}

.gem {
  width: 60px;
  height: 60px;
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
  user-select: none;
}

.gem:hover,
.gem:focus-visible {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(171, 71, 188, 0.3);
}

.gem:focus-visible {
  outline: 3px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.gem.selected {
  border-color: var(--app-correct, #66bb6a);
  transform: scale(1.12);
  box-shadow: 0 4px 16px rgba(102, 187, 106, 0.4);
}

.gem.dragging {
  opacity: 0.4;
  cursor: grabbing;
}

.gem-number {
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #4a148c);
  pointer-events: none;
}

.drop-arrow {
  font-size: 1.5rem;
  color: var(--app-muted, #90a4ae);
  animation: arrow-bounce 1.2s ease-in-out infinite;
}

.chest-zone {
  width: 140px;
  height: 90px;
  border: 3px dashed var(--app-muted, #90a4ae);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.chest-zone:focus-visible {
  outline: 3px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.chest-zone.chest-highlight {
  border-color: var(--app-correct, #66bb6a);
  background: rgba(102, 187, 106, 0.15);
  transform: scale(1.05);
}

.chest-icon {
  font-size: 2rem;
}

.chest-label {
  font-family: var(--app-font, sans-serif);
  font-size: 0.8rem;
  color: var(--app-text-muted, #546e7a);
  text-align: center;
}

@keyframes arrow-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@media (prefers-reduced-motion: reduce) {
  .gem,
  .chest-zone {
    transition: none;
  }
  .drop-arrow {
    animation: none;
  }
}
</style>
