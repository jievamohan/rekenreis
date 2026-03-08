<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import { useI18n } from '~/composables/useI18n'
import { createSeededRng } from '~/utils/seedableRng'

import cardBackSrc from '~/assets/graphics/minigames/memory-match/card-back.svg'

const props = defineProps<{
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const { t } = useI18n()

const cardCount = computed(() => {
  const p = props.difficultyParams?.cardCount ?? 6
  return Math.min(8, Math.max(6, p))
})

/** Build card values: a, b (the pair that sums to correctAnswer), plus distractors */
const cardValues = computed(() => {
  const { a, b, correctAnswer, choices } = props.question
  const pair = [a, b]
  const used = new Set([a, b])
  const distractors = choices.filter((c) => !used.has(c))
  distractors.forEach((c) => used.add(c))
  const seed = a + b * 100 + correctAnswer * 10000
  const rng = createSeededRng(seed)
  const extra = cardCount.value - 2
  const maxVal = Math.max(correctAnswer + 10, 20)
  while (distractors.length < extra) {
    const v = Math.floor(rng() * (maxVal + 1))
    if (v > correctAnswer && !used.has(v)) {
      distractors.push(v)
      used.add(v)
    }
  }
  const vals = [...pair, ...distractors.slice(0, extra)]
  return vals.sort(() => rng() - 0.5)
})

const flipped = ref<Set<number>>(new Set())
const lastFlipped = ref<[number, number] | null>(null)
const answered = ref(false)
const wrongPairTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

watch(
  () => props.question,
  () => {
    flipped.value = new Set()
    lastFlipped.value = null
    answered.value = false
    if (wrongPairTimeout.value) {
      clearTimeout(wrongPairTimeout.value)
      wrongPairTimeout.value = null
    }
  }
)

function isFlipped(index: number): boolean {
  return flipped.value.has(index)
}

function flipCard(index: number) {
  if (answered.value) return
  if (flipped.value.has(index)) return
  if (flipped.value.size >= 2) return

  flipped.value = new Set([...flipped.value, index])

  if (flipped.value.size === 2) {
    const [i1, i2] = [...flipped.value]
    const v1 = cardValues.value[i1]
    const v2 = cardValues.value[i2]
    if (v1 + v2 === props.question.correctAnswer) {
      answered.value = true
      emit('answer', props.question.correctAnswer)
    } else {
      wrongPairTimeout.value = setTimeout(() => {
        flipped.value = new Set()
        lastFlipped.value = null
        wrongPairTimeout.value = null
      }, 800)
    }
  }
}

function handleKeydown(e: KeyboardEvent, index: number) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    flipCard(index)
  }
}
</script>

<template>
  <div
    class="memory-match-scene"
    data-testid="minigame-memory-match"
    role="group"
    :aria-label="t('minigameMemoryMatch.ariaLabel')"
  >
    <div class="cards-grid" role="group" aria-label="Kaarten">
      <button
        v-for="(val, idx) of cardValues"
        :key="idx"
        class="card"
        :class="{ flipped: isFlipped(idx), answered }"
        :disabled="answered"
        :aria-label="isFlipped(idx) ? String(val) : t('memoryMatch.cardBack')"
        tabindex="0"
        @click="flipCard(idx)"
        @keydown="handleKeydown($event, idx)"
      >
        <div class="card-inner">
          <div class="card-face card-back">
            <img :src="cardBackSrc" alt="" width="80" height="100" />
          </div>
          <div class="card-face card-front">
            <span class="card-number">{{ val }}</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.memory-match-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  min-height: 260px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  max-width: 360px;
}

.card {
  aspect-ratio: 4/5;
  min-width: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  border-radius: 8px;
  transition: transform 0.15s ease;
}

.card:focus-visible {
  outline: 3px solid var(--app-focus, #ff9800);
  outline-offset: 2px;
}

.card:disabled {
  cursor: default;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--app-surface, #e0f7fa);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-back {
  transform: rotateY(0deg);
}

.card-front {
  transform: rotateY(180deg);
}

.card-back img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--app-ink, #004d40);
}
</style>
