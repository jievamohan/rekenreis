<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import { useI18n } from '~/composables/useI18n'
import { createSeededRng } from '~/utils/seedableRng'

import reefBaseSrc from '~/assets/graphics/minigames/coral-builder/reef-base.svg'
import coralPiece1Src from '~/assets/graphics/minigames/coral-builder/coral-piece-1.svg'
import coralPiece2Src from '~/assets/graphics/minigames/coral-builder/coral-piece-2.svg'

const CORAL_SRCS = [coralPiece1Src, coralPiece2Src]

const props = defineProps<{
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const { t } = useI18n()

const draggedPiece = ref<number | null>(null)
const isDragging = ref(false)
const dragPos = ref({ x: 0, y: 0 })
const selectedPiece = ref<number | null>(null)
const reefHighlight = ref(false)

function assignCoralPieces(
  choices: number[],
  q: AdditionQuestion
): { value: number; pieceSrc: string }[] {
  const rng = createSeededRng(q.a + q.b * 100 + q.correctAnswer * 10000)
  const indices = [0, 1, 2, 3, 4]
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return choices.map((value, i) => ({
    value,
    pieceSrc: CORAL_SRCS[indices[i] % CORAL_SRCS.length],
  }))
}

const pieces = computed(() => assignCoralPieces(props.question.choices, props.question))

const draggedPieceData = computed(() => {
  if (draggedPiece.value === null) return null
  return pieces.value.find((x) => x.value === draggedPiece.value) ?? null
})

let pointerCleanup: (() => void) | null = null

function submitAnswer(value: number) {
  emit('answer', value)
}

function handlePointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  e.preventDefault()
  dragPos.value = { x: e.clientX, y: e.clientY }
  const reefEl = document.querySelector('[data-drop-target="reef"]')
  if (reefEl) {
    const rect = reefEl.getBoundingClientRect()
    const pad = 40
    const inZone =
      e.clientX >= rect.left - pad &&
      e.clientX <= rect.right + pad &&
      e.clientY >= rect.top - pad &&
      e.clientY <= rect.bottom + pad
    reefHighlight.value = inZone
  }
}

function handlePointerUpOrCancel(e: PointerEvent) {
  if (!isDragging.value || draggedPiece.value === null) return
  e.preventDefault()
  const reefEl = document.querySelector('[data-drop-target="reef"]')
  if (reefEl) {
    const rect = reefEl.getBoundingClientRect()
    const pad = 40
    const inZone =
      e.clientX >= rect.left - pad &&
      e.clientX <= rect.right + pad &&
      e.clientY >= rect.top - pad &&
      e.clientY <= rect.bottom + pad
    if (inZone) {
      submitAnswer(draggedPiece.value)
    }
  }
  cleanupPointer()
}

function cleanupPointer() {
  pointerCleanup?.()
  pointerCleanup = null
  isDragging.value = false
  draggedPiece.value = null
  reefHighlight.value = false
}

function onPointerDown(value: number, e: PointerEvent) {
  e.preventDefault()
  draggedPiece.value = value
  selectedPiece.value = value
  isDragging.value = true
  dragPos.value = { x: e.clientX, y: e.clientY }
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

  const boundMove = (ev: PointerEvent) => handlePointerMove(ev)
  const boundUp = (ev: PointerEvent) => handlePointerUpOrCancel(ev)
  const boundCancel = (ev: PointerEvent) => {
    cleanupPointer()
    ev.preventDefault()
  }

  document.addEventListener('pointermove', boundMove, { capture: true })
  document.addEventListener('pointerup', boundUp, { capture: true })
  document.addEventListener('pointercancel', boundCancel, { capture: true })

  pointerCleanup = () => {
    document.removeEventListener('pointermove', boundMove, { capture: true })
    document.removeEventListener('pointerup', boundUp, { capture: true })
    document.removeEventListener('pointercancel', boundCancel, { capture: true })
  }
}

onUnmounted(() => cleanupPointer())

function onPieceKeydown(value: number) {
  selectedPiece.value = value
}

function onReefKeydown(e: KeyboardEvent) {
  if ((e.key === 'Enter' || e.key === ' ') && selectedPiece.value !== null) {
    e.preventDefault()
    submitAnswer(selectedPiece.value)
    selectedPiece.value = null
  }
}

function onReefClick() {
  if (selectedPiece.value !== null) {
    submitAnswer(selectedPiece.value)
    selectedPiece.value = null
  }
}
</script>

<template>
  <div
    class="coral-reef-scene"
    data-testid="minigame-coral-builder"
    role="group"
    :aria-label="t('minigameCoralBuilder.ariaLabel')"
  >
    <div
      v-if="isDragging && draggedPiece !== null && draggedPieceData"
      class="coral-drag-ghost"
      :style="{ left: `${dragPos.x}px`, top: `${dragPos.y}px` }"
      aria-hidden="true"
    >
      <img :src="draggedPieceData.pieceSrc" class="coral-drag-img" alt="" />
      <span class="coral-number">{{ draggedPiece }}</span>
    </div>

    <p class="reef-instruction">
      {{ t('minigameCoralBuilder.sequenceHint') }}
    </p>

    <div class="source-zone" role="group" :aria-label="t('minigameCoralBuilder.reefLabel')">
      <button
        v-for="(piece, i) in pieces"
        :key="piece.value"
        class="coral-piece"
        :class="{
          selected: selectedPiece === piece.value,
          dragging: isDragging && draggedPiece === piece.value,
        }"
        :aria-label="t('minigameCoralBuilder.pieceLabel', { value: piece.value })"
        :aria-pressed="selectedPiece === piece.value"
        @pointerdown.prevent="onPointerDown(piece.value, $event)"
        @click="onPieceKeydown(piece.value)"
        @keydown.enter.prevent="onPieceKeydown(piece.value)"
        @keydown.space.prevent="onPieceKeydown(piece.value)"
      >
        <img :src="piece.pieceSrc" class="coral-piece-img" alt="" />
        <span class="coral-number">{{ piece.value }}</span>
      </button>
    </div>

    <div class="drop-arrow" aria-hidden="true">↓</div>

    <div
      class="reef-zone"
      data-drop-target="reef"
      role="button"
      tabindex="0"
      :class="{ highlight: reefHighlight }"
      :aria-label="t('minigameCoralBuilder.reefLabel')"
      @click="onReefClick"
      @keydown="onReefKeydown"
    >
      <img :src="reefBaseSrc" class="reef-img" alt="" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.coral-reef-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  min-height: 380px;
  touch-action: none;
  position: relative;
}

.coral-drag-ghost {
  position: fixed;
  width: 80px;
  height: 80px;
  margin-left: -40px;
  margin-top: -40px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1000;
}

.coral-drag-ghost .coral-drag-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.coral-drag-ghost .coral-number {
  position: relative;
  z-index: 1;
  font-family: var(--app-font, sans-serif);
  font-size: 1.25rem;
  font-weight: 800;
  color: #bf360c;
  text-shadow: 0 0 2px #fff, 0 0 4px rgba(255,255,255,0.9);
}

.reef-instruction {
  font-family: var(--app-font, sans-serif);
  font-size: 0.9rem;
  color: var(--app-text-muted, #b0bec5);
  margin: 0;
  text-align: center;
}

.source-zone {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.coral-piece {
  position: relative;
  width: 72px;
  height: 72px;
  min-width: 44px;
  min-height: 44px;
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
  user-select: none;
  touch-action: none;
  -webkit-touch-callout: none;
}

.coral-piece:hover,
.coral-piece:focus-visible {
  transform: scale(1.05);
}

.coral-piece:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 2px;
}

.coral-piece.selected {
  transform: scale(1.08);
}

.coral-piece.dragging {
  opacity: 0.4;
  cursor: grabbing;
}

.coral-piece .coral-piece-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.coral-piece .coral-number {
  position: relative;
  z-index: 1;
  font-family: var(--app-font, sans-serif);
  font-size: 1.25rem;
  font-weight: 800;
  color: #bf360c;
  pointer-events: none;
}

.drop-arrow {
  font-size: 1.5rem;
  color: var(--app-muted, #90a4ae);
  animation: arrow-bounce 1.2s ease-in-out infinite;
}

.reef-zone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  outline: none;
  background: transparent;
  border-radius: 12px;
}

.reef-zone:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 2px;
}

.reef-zone.highlight {
  box-shadow: 0 0 0 4px var(--app-primary, #4fc3f7);
}

.reef-img {
  width: 200px;
  height: auto;
  object-fit: contain;
}

@keyframes arrow-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@media (prefers-reduced-motion: reduce) {
  .coral-piece,
  .reef-zone {
    transition: none;
  }
  .drop-arrow {
    animation: none;
  }
}
</style>
