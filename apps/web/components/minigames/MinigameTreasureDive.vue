<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import { useI18n } from '~/composables/useI18n'
import { createSeededRng } from '~/utils/seedableRng'

import chestSrc from '~/assets/graphics/minigames/treasure-dive/chest.png'
import chestOpenSrc from '~/assets/graphics/minigames/treasure-dive/chest-open.png'
import gem1Src from '~/assets/graphics/minigames/treasure-dive/gem1.png'
import gem2Src from '~/assets/graphics/minigames/treasure-dive/gem2.png'
import gem3Src from '~/assets/graphics/minigames/treasure-dive/gem3.png'
import gem4Src from '~/assets/graphics/minigames/treasure-dive/gem4.png'
import gem5Src from '~/assets/graphics/minigames/treasure-dive/gem5.png'
import gem6Src from '~/assets/graphics/minigames/treasure-dive/gem6.png'
import gem7Src from '~/assets/graphics/minigames/treasure-dive/gem7.png'
import gem8Src from '~/assets/graphics/minigames/treasure-dive/gem8.png'

const GEM_SRCS = [gem1Src, gem2Src, gem3Src, gem4Src, gem5Src, gem6Src, gem7Src, gem8Src]

/** Text color + shadow per gem for readability on the gem surface. */
const GEM_TEXT_STYLES: Record<
  string,
  { color: string; shadow: string }
> = {
  [gem1Src]: { color: '#fff', shadow: '0 0 2px #000, 0 0 4px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' },
  [gem2Src]: { color: '#fff', shadow: '0 0 2px #000, 0 0 4px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' },
  [gem3Src]: { color: '#fff', shadow: '0 0 2px #000, 0 0 4px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' },
  [gem4Src]: { color: '#1a1a2e', shadow: '0 0 2px #fff, 0 0 4px rgba(255,255,255,0.9), 0 1px 2px rgba(255,255,255,0.8)' },
  [gem5Src]: { color: '#fff', shadow: '0 0 2px #000, 0 0 4px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' },
  [gem6Src]: { color: '#fff', shadow: '0 0 2px #000, 0 0 4px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' },
  [gem7Src]: { color: '#fff', shadow: '0 0 2px #000, 0 0 4px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' },
  [gem8Src]: { color: '#fff', shadow: '0 0 2px #000, 0 0 4px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' },
}
const DEFAULT_TEXT_STYLE = { color: '#fff', shadow: '0 0 2px #000, 0 0 4px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' }

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

function assignUniqueGems(
  choices: number[],
  q: AdditionQuestion
): { value: number; gemSrc: string; textColor: string; textShadow: string }[] {
  const rng = createSeededRng(q.a + q.b * 100 + q.correctAnswer * 10000)
  const indices = [0, 1, 2, 3, 4]
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return choices.map((value, i) => {
    const src = GEM_SRCS[indices[i] % GEM_SRCS.length]
    const style = GEM_TEXT_STYLES[src] ?? DEFAULT_TEXT_STYLE
    return {
      value,
      gemSrc: src,
      textColor: style.color,
      textShadow: style.shadow,
    }
  })
}

const gems = computed(() => assignUniqueGems(props.question.choices, props.question))

const draggedGemData = computed(() => {
  if (draggedGem.value === null) return null
  return gems.value.find((x) => x.value === draggedGem.value) ?? null
})

const showChestOpen = computed(
  () => chestHighlight.value && isDragging.value
)

let pointerCleanup: (() => void) | null = null

function submitAnswer(value: number) {
  emit('answer', value)
}

function handlePointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  e.preventDefault()
  dragPos.value = { x: e.clientX, y: e.clientY }
  const chestEl = document.querySelector('[data-drop-target="chest"]')
  if (chestEl) {
    const rect = chestEl.getBoundingClientRect()
    const pad = 40
    const inZone =
      e.clientX >= rect.left - pad &&
      e.clientX <= rect.right + pad &&
      e.clientY >= rect.top - pad &&
      e.clientY <= rect.bottom + pad
    chestHighlight.value = inZone
  }
}

function handlePointerUpOrCancel(e: PointerEvent) {
  if (!isDragging.value || draggedGem.value === null) return
  e.preventDefault()
  const chestEl = document.querySelector('[data-drop-target="chest"]')
  if (chestEl) {
    const rect = chestEl.getBoundingClientRect()
    const pad = 40
    const inZone =
      e.clientX >= rect.left - pad &&
      e.clientX <= rect.right + pad &&
      e.clientY >= rect.top - pad &&
      e.clientY <= rect.bottom + pad
    if (inZone) {
      submitAnswer(draggedGem.value)
    }
  }
  cleanupPointer()
}

function cleanupPointer() {
  pointerCleanup?.()
  pointerCleanup = null
  isDragging.value = false
  draggedGem.value = null
  chestHighlight.value = false
}

function onPointerDown(value: number, e: PointerEvent) {
  e.preventDefault()
  draggedGem.value = value
  selectedGem.value = value
  isDragging.value = true
  dragPos.value = { x: e.clientX, y: e.clientY }
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

  const boundMove = (ev: PointerEvent) => handlePointerMove(ev)
  const boundUp = (ev: PointerEvent) => {
    handlePointerUpOrCancel(ev)
  }
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

function onGemKeydown(value: number) {
  selectedGem.value = value
}

function onChestKeydown(e: KeyboardEvent) {
  if ((e.key === 'Enter' || e.key === ' ') && selectedGem.value !== null) {
    e.preventDefault()
    submitAnswer(selectedGem.value)
    selectedGem.value = null
  }
}

function onChestClick() {
  if (selectedGem.value !== null) {
    submitAnswer(selectedGem.value)
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
    <div
      v-if="isDragging && draggedGem !== null && draggedGemData"
      class="gem-drag-ghost"
      :style="{ left: `${dragPos.x}px`, top: `${dragPos.y}px` }"
      aria-hidden="true"
    >
      <img :src="draggedGemData.gemSrc" class="gem-drag-img" alt="" />
      <span class="gem-number" :style="{ color: draggedGemData.textColor, textShadow: draggedGemData.textShadow }">{{ draggedGem }}</span>
    </div>
    <div class="source-zone" role="group" :aria-label="t('minigameTreasureDive.gemLabel', { value: '' })">
      <button
        v-for="(gem, i) in gems"
        :key="gem.value"
        class="gem"
        :class="{
          selected: selectedGem === gem.value,
          dragging: isDragging && draggedGem === gem.value,
        }"
        :style="{ '--sparkle-delay': `${i * 0.3}s` }"
        :aria-label="t('minigameTreasureDive.gemLabel', { value: gem.value })"
        :aria-pressed="selectedGem === gem.value"
        @pointerdown.prevent="onPointerDown(gem.value, $event)"
        @click="onGemKeydown(gem.value)"
        @keydown.enter.prevent="onGemKeydown(gem.value)"
        @keydown.space.prevent="onGemKeydown(gem.value)"
      >
        <img :src="gem.gemSrc" class="gem-img" alt="" />
        <span class="gem-number" :style="{ color: gem.textColor, textShadow: gem.textShadow }">{{ gem.value }}</span>
      </button>
    </div>

    <div class="drop-arrow" aria-hidden="true">↓</div>

    <div
      class="chest-zone"
      data-drop-target="chest"
      role="button"
      tabindex="0"
      :aria-label="t('minigameTreasureDive.chestReady')"
      @click="onChestClick"
      @keydown="onChestKeydown"
    >
      <img
        :src="showChestOpen ? chestOpenSrc : chestSrc"
        class="chest-img"
        alt=""
        aria-hidden="true"
      />
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
  min-height: 420px;
  touch-action: none;
  position: relative;
}

.gem-drag-ghost {
  position: fixed;
  width: 100px;
  height: 100px;
  margin-left: -50px;
  margin-top: -50px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1000;
}
.gem-drag-ghost .gem-drag-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.gem-drag-ghost .gem-number {
  position: relative;
  z-index: 1;
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 800;
}

.source-zone {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.gem {
  --sparkle-delay: 0s;
  position: relative;
  width: 100px;
  height: 100px;
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

.gem:hover,
.gem:focus-visible {
  transform: scale(1.08);
}

.gem:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 2px;
}

.gem.selected {
  transform: scale(1.12);
}

.gem.dragging {
  opacity: 0.4;
  cursor: grabbing;
}

.gem.dragging .gem-img {
  animation: none;
}

.gem .gem-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  animation: gem-sparkle 2.5s ease-in-out infinite;
  animation-delay: var(--sparkle-delay);
}

.gem .gem-number {
  position: relative;
  z-index: 1;
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 800;
  pointer-events: none;
}

.drop-arrow {
  font-size: 1.5rem;
  color: var(--app-muted, #90a4ae);
  animation: arrow-bounce 1.2s ease-in-out infinite;
}

.chest-zone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: none;
  outline: none;
  background: transparent;
}

.chest-zone:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 2px;
}

.chest-img {
  width: 220px;
  height: auto;
  object-fit: contain;
}

@keyframes arrow-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@keyframes gem-sparkle {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4)); }
  50% { filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.25)); }
}

@media (prefers-reduced-motion: reduce) {
  .gem,
  .chest-zone {
    transition: none;
  }
  .gem .gem-img {
    animation: none !important;
  }
  .drop-arrow {
    animation: none;
  }
}
</style>
