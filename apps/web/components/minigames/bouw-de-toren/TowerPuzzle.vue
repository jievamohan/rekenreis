<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TowerPuzzle as TowerPuzzleType } from '~/types/tower'
import { useI18n } from '~/composables/useI18n'

import towerIcon from '~/assets/graphics/minigames/bouw-de-toren/tower.svg'

const ghostEl = ref<HTMLDivElement | null>(null)

const props = withDefaults(
  defineProps<{
    puzzle: TowerPuzzleType
    totalRounds?: number
    currentRoundIndex?: number
    /** When true, blocks and zones are not interactive (e.g. waiting for next puzzle) */
    frozen?: boolean
    /** When true, current tower is shown as active (after answer, waiting for next) */
    roundComplete?: boolean
  }>(),
  { totalRounds: 1, currentRoundIndex: 0, frozen: false, roundComplete: false }
)

const emit = defineEmits<{
  correct: []
  wrong: []
}>()

const { t } = useI18n()

/** Max tower icons before switching to progress bar (3 rows × 3 = 9) */
const MAX_TOWERS_FOR_ICONS = 9

const useProgressBar = computed(() => (props.totalRounds ?? 1) > MAX_TOWERS_FOR_ICONS)

const completedProgressPercent = computed(() => {
  const total = props.totalRounds ?? 1
  const current = props.currentRoundIndex ?? 0
  return total > 0 ? Math.min(100, (current / total) * 100) : 0
})

const currentRoundDisplay = computed(() => (props.currentRoundIndex ?? 0) + 1)

const zone1 = ref<number | null>(null)
const zone2 = ref<number | null>(null)
const selectedBlock = ref<number | null>(null)
const focusedZone = ref<1 | 2 | null>(null)
const isDragging = ref(false)
const dragBlock = ref<number | null>(null)
/** When dragging from a drop zone, which zone (1 or 2); null when dragging from pool */
const dragSourceZone = ref<1 | 2 | null>(null)
const dragPos = ref({ x: 0, y: 0 })
const wrongShake = ref(false)
const correctFeedback = ref<{ a: number; b: number; sum: number } | null>(null)
const highlightedZone = ref<1 | 2 | null>(null)

const prefersReducedMotion = computed(() => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const placedSet = computed(() =>
  new Set([zone1.value, zone2.value].filter((x): x is number => x !== null))
)

/** Display list: all blocks; placeholder when placed or when dragging (show dashed slot as soon as block is picked up) */
const blocksDisplay = computed(() =>
  props.puzzle.blocks.map((block) => {
    const isPlaced = placedSet.value.has(block)
    const isDraggingThis = isDragging.value && block === dragBlock.value
    return {
      value: block,
      isPlaceholder: isPlaced || isDraggingThis,
      isDraggingThis,
      inPool: !isPlaced,
    }
  })
)

const canSubmit = computed(
  () => zone1.value !== null && zone2.value !== null && correctFeedback.value === null
)

function validateAndSubmit() {
  if (!canSubmit.value || correctFeedback.value !== null) return
  const sum = zone1.value! + zone2.value!
  if (sum === props.puzzle.target) {
    correctFeedback.value = { a: zone1.value!, b: zone2.value!, sum }
    emit('correct')
    // State stays frozen: zones and correctFeedback remain until parent loads next puzzle
  } else {
    wrongShake.value = true
    const duration = prefersReducedMotion.value ? 0 : 300
    setTimeout(() => { wrongShake.value = false }, duration)
    emit('wrong')
    // State stays frozen: zones remain filled until parent loads next puzzle
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

function updateGhostPos(x: number, y: number, offsetX: number, offsetY: number) {
  const el = ghostEl.value
  if (el) {
    el.style.left = `${x - offsetX}px`
    el.style.top = `${y - offsetY}px`
  }
}

function onBlockPointerDown(value: number, e: PointerEvent, sourceZone?: 1 | 2) {
  if (props.frozen) return
  e.preventDefault()
  const target = e.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const grabOffsetX = e.clientX - rect.left
  const grabOffsetY = e.clientY - rect.top
  dragBlock.value = value
  dragSourceZone.value = sourceZone ?? null
  isDragging.value = true
  dragPos.value = { x: e.clientX, y: e.clientY }
  updateGhostPos(e.clientX, e.clientY, grabOffsetX, grabOffsetY)
  if (ghostEl.value) ghostEl.value.textContent = String(value)
  target.setPointerCapture(e.pointerId)
  const boundMove = (ev: PointerEvent) => {
    if (isDragging.value) {
      dragPos.value = { x: ev.clientX, y: ev.clientY }
      updateGhostPos(ev.clientX, ev.clientY, grabOffsetX, grabOffsetY)
      const pad = 50
      const zones = [
        document.querySelector('[data-drop-zone="1"]')?.getBoundingClientRect(),
        document.querySelector('[data-drop-zone="2"]')?.getBoundingClientRect(),
      ]
      let found: 1 | 2 | null = null
      for (let i = 0; i < 2; i++) {
        const rect = zones[i]
        if (rect && ev.clientX >= rect.left - pad && ev.clientX <= rect.right + pad &&
            ev.clientY >= rect.top - pad && ev.clientY <= rect.bottom + pad) {
          const z = (i + 1) as 1 | 2
          const isEmpty = (z === 1 && zone1.value === null) || (z === 2 && zone2.value === null)
          if (isEmpty) found = z
          break
        }
      }
      highlightedZone.value = found
    }
  }
  function endDrag() {
    if (!isDragging.value) return
    isDragging.value = false
    dragBlock.value = null
    dragSourceZone.value = null
    highlightedZone.value = null
    document.removeEventListener('pointermove', boundMove)
    document.removeEventListener('pointerup', boundUp)
    document.removeEventListener('pointercancel', boundUp)
    target.removeEventListener('lostpointercapture', onLostCapture)
  }

  const boundUp = (ev: PointerEvent) => {
    if (dragBlock.value === null) return
    const block = dragBlock.value
    const sourceZone = dragSourceZone.value
    const pad = 50
    const zones = [
      document.querySelector('[data-drop-zone="1"]')?.getBoundingClientRect(),
      document.querySelector('[data-drop-zone="2"]')?.getBoundingClientRect(),
    ]
    let droppedOnZone = false
    for (let i = 0; i < 2; i++) {
      const rect = zones[i]
      if (rect && ev.clientX >= rect.left - pad && ev.clientX <= rect.right + pad &&
          ev.clientY >= rect.top - pad && ev.clientY <= rect.bottom + pad) {
        const z = (i + 1) as 1 | 2
        const isSameZone = sourceZone === z
        if (z === 1 && (zone1.value === null || isSameZone)) {
          zone1.value = block
          if (sourceZone === 2) zone2.value = null
          droppedOnZone = true
        } else if (z === 2 && (zone2.value === null || isSameZone)) {
          zone2.value = block
          if (sourceZone === 1) zone1.value = null
          droppedOnZone = true
        }
        break
      }
    }
    if (!droppedOnZone && sourceZone !== null) {
      if (sourceZone === 1) zone1.value = null
      else if (sourceZone === 2) zone2.value = null
    }
    if (canSubmit.value) validateAndSubmit()
    endDrag()
  }

  const onLostCapture = () => {
    // Don't call endDrag here: lostpointercapture often fires before pointerup when
    // dropping on a zone, which would clear dragBlock before boundUp can process the drop.
    // Only hide the ghost and stop move tracking; let boundUp do the full cleanup.
    if (!isDragging.value) return
    isDragging.value = false
    highlightedZone.value = null
    document.removeEventListener('pointermove', boundMove)
    target.removeEventListener('lostpointercapture', onLostCapture)
  }

  document.addEventListener('pointermove', boundMove)
  document.addEventListener('pointerup', boundUp, { once: true })
  document.addEventListener('pointercancel', boundUp, { once: true })
  target.addEventListener('lostpointercapture', onLostCapture, { once: true })
}
</script>

<template>
  <div
    class="tower-puzzle"
    :class="{ 'tower-puzzle-frozen': frozen }"
    data-testid="tower-puzzle"
    role="group"
    :aria-label="t('minigameBouwDeToren.puzzleLabel', { target: puzzle.target })"
  >
    <div v-if="useProgressBar" class="tower-progress-wrap" role="group" :aria-label="t('minigameBouwDeToren.towersProgress')">
      <div
        class="tower-round-progress"
        role="progressbar"
        :aria-valuemin="0"
        :aria-valuemax="totalRounds"
        :aria-valuenow="currentRoundIndex"
        :aria-label="t('play.roundProgress')"
      >
        <div
          class="tower-round-progress-fill"
          :style="{ width: `${completedProgressPercent}%` }"
        />
        <div
          class="tower-round-progress-node tower-round-progress-node-current"
          :style="{ left: `${completedProgressPercent}%` }"
          aria-hidden="true"
        >
          {{ currentRoundDisplay }}
        </div>
        <div class="tower-round-progress-node tower-round-progress-node-target" aria-hidden="true">
          {{ totalRounds }}
        </div>
      </div>
    </div>
    <div v-else class="towers-progress" role="group" :aria-label="t('minigameBouwDeToren.towersProgress')">
      <div
        v-for="idx in totalRounds"
        :key="`tower-${idx - 1}`"
        class="tower-progress-slot"
        :class="{
          'tower-progress-completed': idx - 1 < currentRoundIndex,
          'tower-progress-active': roundComplete && idx - 1 === currentRoundIndex,
          'tower-progress-inactive': idx - 1 > currentRoundIndex || (idx - 1 === currentRoundIndex && !roundComplete)
        }"
        role="img"
        :aria-label="idx - 1 < currentRoundIndex ? t('minigameBouwDeToren.towerCompleted') : idx - 1 === currentRoundIndex ? t('minigameBouwDeToren.towerActive') : t('minigameBouwDeToren.towerPending')"
      >
        <img :src="towerIcon" alt="" class="tower-progress-icon" aria-hidden="true" width="48" height="60" />
      </div>
    </div>
    <div class="target-row">
      <img :src="towerIcon" alt="" class="tower-icon" aria-hidden="true" width="56" height="70" />
      <div class="target-display" aria-live="polite">
        {{ puzzle.target }}
      </div>
    </div>
    <div class="dropzones-row">
      <div class="dropzones">
              <div
                data-drop-zone="1"
                class="dropzone"
                :class="{ filled: zone1 !== null, wrongShake, highlight: highlightedZone === 1 }"
                role="button"
                tabindex="0"
                :aria-label="t('minigameBouwDeToren.zoneLabel', { n: 1, value: zone1 ?? '' })"
                @focus="onZoneFocus(1)"
                @keydown="onZoneKeydown(1, $event)"
              >
                <span
                  v-if="zone1 !== null && !(isDragging && dragBlock === zone1)"
                  class="zone-value zone-value-draggable"
                  @pointerdown.stop="onBlockPointerDown(zone1!, $event, 1)"
                >{{ zone1 }}</span>
              </div>
              <span class="plus" aria-hidden="true">+</span>
              <div
                data-drop-zone="2"
                class="dropzone"
                :class="{ filled: zone2 !== null, wrongShake, highlight: highlightedZone === 2 }"
                role="button"
                tabindex="0"
                :aria-label="t('minigameBouwDeToren.zoneLabel', { n: 2, value: zone2 ?? '' })"
                @focus="onZoneFocus(2)"
                @keydown="onZoneKeydown(2, $event)"
              >
                <span
                  v-if="zone2 !== null && !(isDragging && dragBlock === zone2)"
                  class="zone-value zone-value-draggable"
                  @pointerdown.stop="onBlockPointerDown(zone2!, $event, 2)"
                >{{ zone2 }}</span>
              </div>
            </div>
    </div>
    <Teleport to="body">
      <div
        v-show="isDragging && dragBlock !== null"
        ref="ghostEl"
        class="block-ghost"
        aria-hidden="true"
      >
        {{ dragBlock ?? '' }}
      </div>
    </Teleport>
    <div class="blocks-pool" role="group" :aria-label="t('minigameBouwDeToren.blocksLabel')">
      <template v-for="(item, i) in blocksDisplay" :key="`${item.value}-${i}`">
        <div class="block-slot">
          <div v-if="item.isPlaceholder" class="block block-placeholder" aria-hidden="true" />
          <button
            v-else
            class="block"
            :class="{ selected: selectedBlock === item.value, 'block-dragging': item.isDraggingThis }"
            :aria-label="t('minigameBouwDeToren.blockLabel', { value: item.value })"
            :aria-pressed="selectedBlock === item.value"
            :aria-hidden="item.isDraggingThis"
            @pointerdown="onBlockPointerDown(item.value, $event)"
            @keydown.enter.prevent="onBlockSelect(item.value)"
            @keydown.space.prevent="onBlockSelect(item.value)"
          >
            {{ item.value }}
          </button>
        </div>
      </template>
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

.tower-puzzle-frozen {
  pointer-events: none;
}

.target-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tower-icon {
  flex-shrink: 0;
  opacity: 0.85;
}

.target-display {
  font-size: 2.75rem;
  font-weight: 800;
  color: var(--app-text, #1a1a2e);
}

.tower-progress-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  min-width: min(92vw, 440px);
}

.tower-round-progress {
  position: relative;
  width: min(92vw, 440px);
  height: 1rem;
  background: #ffffff !important;
  border-radius: 999px;
  overflow: visible;
  border: 1px solid rgba(1, 36, 43, 0.22);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.9);
}

.tower-round-progress-fill {
  height: calc(100% - 4px);
  margin: 2px;
  background: var(--app-primary);
  border-radius: 999px;
  transition: width 180ms ease-out;
}

.tower-round-progress-node {
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

.tower-round-progress-node-current {
  z-index: 2;
  background: linear-gradient(180deg, #41e3ff 0%, #00bcd4 100%);
  border-color: rgba(1, 36, 43, 0.28);
}

.tower-round-progress-node-target {
  left: 100%;
  z-index: 1;
  background: linear-gradient(180deg, #ffffff 0%, #f3fbff 100%);
  color: rgba(1, 36, 43, 0.3);
  border-color: rgba(1, 36, 43, 0.24);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.12);
}

.towers-progress {
  display: grid;
  grid-template-columns: repeat(3, clamp(24px, 6vw, 48px));
  justify-content: center;
  gap: clamp(0.35rem, 1.5vw, 0.75rem);
  margin-bottom: 0.5rem;
  max-width: 100%;
}

.tower-progress-slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tower-progress-icon {
  display: block;
  width: clamp(24px, 6vw, 48px);
  height: auto;
  aspect-ratio: 48 / 60;
}

.tower-progress-completed .tower-progress-icon,
.tower-progress-active .tower-progress-icon {
  opacity: 1;
  filter: none;
}

.tower-progress-inactive .tower-progress-icon {
  opacity: 0.25;
  filter: grayscale(1);
}

.dropzones-row {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
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
  --zone-value-text: #01242b;
}

.dropzone.highlight {
  border-color: var(--app-primary, #4fc3f7);
  border-style: solid;
  box-shadow: 0 0 0 2px rgba(79, 195, 247, 0.4);
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

.zone-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--zone-value-text, var(--app-text, #01242b));
}

.zone-value-draggable {
  cursor: grab;
  display: inline-block;
  padding: 0.25rem;
  margin: -0.25rem;
  border-radius: 4px;
}

.zone-value-draggable:active {
  cursor: grabbing;
}

.plus {
  font-size: 1.25rem;
  font-weight: 700;
}

.block-ghost {
  position: fixed;
  width: 48px;
  height: 48px;
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

.block-slot {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  position: relative;
}

.block-slot .block {
  position: absolute;
  inset: 0;
}

.block {
  box-sizing: border-box;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  padding: 0;
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

.block:not(:disabled):hover:not(.block-dragging),
.block:not(:disabled):focus-visible:not(.block-dragging) {
  transform: scale(1.05);
}

.block.selected {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 2px;
}

.block-dragging {
  visibility: hidden;
  pointer-events: none;
  transform: none;
}

.block-placeholder {
  box-sizing: border-box;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  padding: 0;
  border: 2px dashed var(--app-map-path-edge, #999);
  border-radius: 8px;
  background: transparent;
  cursor: default;
}

.block:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
