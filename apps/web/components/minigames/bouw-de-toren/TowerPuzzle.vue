<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import type { TowerPuzzle as TowerPuzzleType } from '~/types/tower'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  puzzle: TowerPuzzleType
}>()

const emit = defineEmits<{
  correct: []
  wrong: []
}>()

const { t } = useI18n()

const zone1 = ref<number | null>(null)
const zone2 = ref<number | null>(null)
const selectedBlock = ref<number | null>(null)
const focusedZone = ref<1 | 2 | null>(null)
const isDragging = ref(false)
const dragBlock = ref<number | null>(null)
const dragPos = ref({ x: 0, y: 0 })
const wrongShake = ref(false)
const correctFeedback = ref<{ a: number; b: number; sum: number } | null>(null)

const prefersReducedMotion = computed(() => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const blocksInPool = computed(() => {
  const placed = new Set([zone1.value, zone2.value].filter((x): x is number => x !== null))
  return props.puzzle.blocks.filter((b) => !placed.has(b))
})

const canSubmit = computed(
  () => zone1.value !== null && zone2.value !== null && correctFeedback.value === null
)

let correctFeedbackTimeout: ReturnType<typeof setTimeout> | null = null

function validateAndSubmit() {
  if (!canSubmit.value || correctFeedback.value !== null) return
  const sum = zone1.value! + zone2.value!
  if (sum === props.puzzle.target) {
    correctFeedback.value = { a: zone1.value!, b: zone2.value!, sum }
    correctFeedbackTimeout = setTimeout(() => {
      correctFeedback.value = null
      zone1.value = null
      zone2.value = null
      emit('correct')
      correctFeedbackTimeout = null
    }, prefersReducedMotion.value ? 0 : 300)
  } else {
    wrongShake.value = true
    const duration = prefersReducedMotion.value ? 0 : 300
    setTimeout(() => {
      zone1.value = null
      zone2.value = null
      wrongShake.value = false
      emit('wrong')
    }, duration)
  }
}

function placeInZone(zone: 1 | 2, value: number) {
  if (zone === 1) {
    if (zone1.value !== null) return
    zone1.value = value
  } else {
    if (zone2.value !== null) return
    zone2.value = value
  }
  if (canSubmit.value) validateAndSubmit()
}

function onBlockSelect(value: number) {
  selectedBlock.value = value
}

function onZoneFocus(zone: 1 | 2) {
  focusedZone.value = zone
}

function onZoneKeydown(zone: 1 | 2, e: KeyboardEvent) {
  if ((e.key === 'Enter' || e.key === ' ') && selectedBlock.value !== null) {
    e.preventDefault()
    placeInZone(zone, selectedBlock.value)
    selectedBlock.value = null
  }
}

function onBlockPointerDown(value: number, e: PointerEvent) {
  e.preventDefault()
  dragBlock.value = value
  isDragging.value = true
  dragPos.value = { x: e.clientX, y: e.clientY }
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  const boundMove = (ev: PointerEvent) => {
    if (isDragging.value) dragPos.value = { x: ev.clientX, y: ev.clientY }
  }
  const boundUp = (ev: PointerEvent) => {
    if (!isDragging.value || dragBlock.value === null) return
    const pad = 50
    const zones = [
      document.querySelector('[data-drop-zone="1"]')?.getBoundingClientRect(),
      document.querySelector('[data-drop-zone="2"]')?.getBoundingClientRect(),
    ]
    for (let i = 0; i < 2; i++) {
      const rect = zones[i]
      if (rect && ev.clientX >= rect.left - pad && ev.clientX <= rect.right + pad &&
          ev.clientY >= rect.top - pad && ev.clientY <= rect.bottom + pad) {
        const z = (i + 1) as 1 | 2
        if (z === 1 && zone1.value === null) {
          zone1.value = dragBlock.value
        } else if (z === 2 && zone2.value === null) {
          zone2.value = dragBlock.value
        }
        break
      }
    }
    if (canSubmit.value) validateAndSubmit()
    isDragging.value = false
    dragBlock.value = null
    document.removeEventListener('pointermove', boundMove)
    document.removeEventListener('pointerup', boundUp)
  }
  document.addEventListener('pointermove', boundMove)
  document.addEventListener('pointerup', boundUp, { once: true })
}

onBeforeUnmount(() => {
  if (correctFeedbackTimeout) clearTimeout(correctFeedbackTimeout)
})
</script>

<template>
  <div
    class="tower-puzzle"
    data-testid="tower-puzzle"
    role="group"
    :aria-label="t('minigameBouwDeToren.puzzleLabel', { target: puzzle.target })"
  >
    <div class="target-display" aria-live="polite">
      {{ puzzle.target }}
    </div>
    <div
      v-if="correctFeedback"
      class="correct-feedback"
      role="status"
      aria-live="polite"
      :data-testid="'correct-sum'"
    >
      {{ t('minigameBouwDeToren.sumCorrect', correctFeedback) }}
    </div>
    <div class="dropzones">
      <div
        data-drop-zone="1"
        class="dropzone"
        :class="{ filled: zone1 !== null && !correctFeedback, wrongShake }"
        role="button"
        tabindex="0"
        :aria-label="t('minigameBouwDeToren.zoneLabel', { n: 1, value: zone1 ?? '' })"
        @focus="onZoneFocus(1)"
        @keydown="onZoneKeydown(1, $event)"
      >
        <span v-if="zone1 !== null" class="zone-value">{{ zone1 }}</span>
      </div>
      <span class="plus" aria-hidden="true">+</span>
      <div
        data-drop-zone="2"
        class="dropzone"
        :class="{ filled: zone2 !== null && !correctFeedback, wrongShake }"
        role="button"
        tabindex="0"
        :aria-label="t('minigameBouwDeToren.zoneLabel', { n: 2, value: zone2 ?? '' })"
        @focus="onZoneFocus(2)"
        @keydown="onZoneKeydown(2, $event)"
      >
        <span v-if="zone2 !== null" class="zone-value">{{ zone2 }}</span>
      </div>
    </div>
    <div v-if="isDragging && dragBlock !== null" class="block-ghost" :style="{ left: `${dragPos.x}px`, top: `${dragPos.y}px` }" aria-hidden="true">
      {{ dragBlock }}
    </div>
    <div class="blocks-pool" role="group" :aria-label="t('minigameBouwDeToren.blocksLabel')">
      <button
        v-for="(block, i) in blocksInPool"
        :key="`${block}-${i}`"
        class="block"
        :class="{ selected: selectedBlock === block }"
        :aria-label="t('minigameBouwDeToren.blockLabel', { value: block })"
        :aria-pressed="selectedBlock === block"
        @pointerdown="onBlockPointerDown(block, $event)"
        @keydown.enter.prevent="onBlockSelect(block)"
        @keydown.space.prevent="onBlockSelect(block)"
      >
        {{ block }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tower-puzzle {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  touch-action: none;
  position: relative;
}

.target-display {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--app-text, #1a1a2e);
}

.dropzones {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dropzone {
  width: 56px;
  height: 56px;
  min-width: 56px;
  min-height: 56px;
  border: 2px dashed var(--app-map-path-edge, #999);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--app-surface, #f5f5f5);
  cursor: pointer;
}

.dropzone.filled {
  border-style: solid;
  background: var(--app-node-unlocked, #e3f2fd);
}

.dropzone.wrongShake {
  animation: wobble 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .dropzone.wrongShake {
    animation: none;
  }
}

@keyframes wobble {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.correct-feedback {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-primary, #4fc3f7);
  padding: 0.5rem;
}

.zone-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.plus {
  font-size: 1.25rem;
  font-weight: 700;
}

.block-ghost {
  position: fixed;
  width: 48px;
  height: 48px;
  margin-left: -24px;
  margin-top: -24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--app-surface, #fff);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  pointer-events: none;
  z-index: 1000;
}

.blocks-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.block {
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  border: 2px solid var(--app-map-path-edge, #999);
  border-radius: 8px;
  background: var(--app-surface, #fff);
  cursor: grab;
  transition: transform 0.15s ease;
}

.block:not(:disabled):hover,
.block:not(:disabled):focus-visible {
  transform: scale(1.05);
}

.block.selected {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 2px;
}

.block:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
