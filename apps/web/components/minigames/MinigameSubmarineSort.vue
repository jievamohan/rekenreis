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
const sortedItems = ref<Map<string, number[]>>(new Map())
const wrongBin = ref<string | null>(null)

const items = computed(() =>
  props.question.choices.map((choice) => ({ value: choice }))
)

const bins = computed(() => {
  const correct = props.question.correctAnswer
  const other = props.question.choices.find((c) => c !== correct) ?? correct + 1
  const binList = [
    { id: 'correct', label: correct, isCorrect: true },
    { id: 'other', label: other, isCorrect: false },
  ]
  return Math.random() > 0.5 ? binList : binList.reverse()
})

function selectItem(value: number) {
  selectedItem.value = value
}

function sortIntoBin(binId: string) {
  if (selectedItem.value === null) return

  const bin = bins.value.find((b) => b.id === binId)
  if (!bin) return

  if (bin.label === selectedItem.value) {
    const existing = sortedItems.value.get(binId) ?? []
    existing.push(selectedItem.value)
    sortedItems.value.set(binId, existing)
    emit('answer', selectedItem.value)
    selectedItem.value = null
  } else {
    wrongBin.value = binId
    setTimeout(() => { wrongBin.value = null }, 600)
  }
}

function onBinKeydown(binId: string, e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    sortIntoBin(binId)
  }
}
</script>

<template>
  <div
    class="submarine-sort-scene"
    data-testid="minigame-submarine-sort"
    role="group"
    :aria-label="t('minigameSubmarineSort.ariaLabel')"
  >
    <div class="items-conveyor" role="group" :aria-label="t('minigameSubmarineSort.itemLabel', { value: '' })">
      <button
        v-for="item in items"
        :key="item.value"
        class="sort-item"
        :class="{ selected: selectedItem === item.value }"
        :aria-label="t('minigameSubmarineSort.itemLabel', { value: item.value })"
        :aria-pressed="selectedItem === item.value"
        @click="selectItem(item.value)"
        @keydown.enter.prevent="selectItem(item.value)"
        @keydown.space.prevent="selectItem(item.value)"
      >
        <span class="item-number">{{ item.value }}</span>
      </button>
    </div>

    <div class="sort-arrow" aria-hidden="true">↓</div>

    <div class="bins-row">
      <div
        v-for="bin in bins"
        :key="bin.id"
        class="sort-bin"
        :class="{
          'bin-ready': selectedItem !== null,
          'bin-wrong': wrongBin === bin.id,
        }"
        role="button"
        tabindex="0"
        :aria-label="t('minigameSubmarineSort.compartmentLabel') + ' ' + bin.label"
        @click="sortIntoBin(bin.id)"
        @keydown="onBinKeydown(bin.id, $event)"
      >
        <span class="bin-emoji" aria-hidden="true">🚢</span>
        <span class="bin-label">{{ bin.label }}</span>
        <span v-if="(sortedItems.get(bin.id) ?? []).length > 0" class="bin-count">
          {{ (sortedItems.get(bin.id) ?? []).length }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.submarine-sort-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  min-height: 300px;
}

.items-conveyor {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0.75rem;
  border: 2px dashed var(--app-muted, #90a4ae);
  border-radius: 16px;
  background: rgba(66, 165, 245, 0.05);
}

.sort-item {
  width: 60px;
  height: 60px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 12px;
  border: 2px solid var(--app-primary, #42a5f5);
  background: linear-gradient(135deg, #bbdefb, #90caf9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  user-select: none;
}

.sort-item:hover,
.sort-item:focus-visible {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.3);
}

.sort-item:focus-visible {
  outline: 3px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.sort-item.selected {
  border-color: var(--app-correct, #66bb6a);
  transform: scale(1.12);
  box-shadow: 0 4px 16px rgba(102, 187, 106, 0.4);
}

.item-number {
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #0d47a1);
  pointer-events: none;
}

.sort-arrow {
  font-size: 1.5rem;
  color: var(--app-muted, #90a4ae);
}

.bins-row {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.sort-bin {
  width: 100px;
  height: 100px;
  border: 3px dashed var(--app-muted, #90a4ae);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease;
  position: relative;
}

.sort-bin:focus-visible {
  outline: 3px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.sort-bin.bin-ready {
  border-color: var(--app-correct, #66bb6a);
  background: rgba(102, 187, 106, 0.08);
}

.sort-bin.bin-wrong {
  animation: bin-shake 0.4s ease;
  border-color: var(--app-wrong, #ef5350);
  background: rgba(239, 83, 80, 0.08);
}

.bin-emoji {
  font-size: 1.5rem;
}

.bin-label {
  font-family: var(--app-font, sans-serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--app-text-primary, #e0f7fa);
}

.bin-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--app-correct, #66bb6a);
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

@keyframes bin-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

@media (prefers-reduced-motion: reduce) {
  .sort-item,
  .sort-bin {
    transition: none;
  }
  .sort-bin.bin-wrong {
    animation: none;
  }
}
</style>
