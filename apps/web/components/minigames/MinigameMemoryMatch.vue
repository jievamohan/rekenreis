<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import { useI18n } from '~/composables/useI18n'
import { createSeededRng } from '~/utils/seedableRng'

import cardBackSrc from '~/assets/graphics/minigames/memory-match/card-back.svg'

export interface MemoryPair {
  a: number
  b: number
  answer: number
}

export interface MemoryCard {
  id: string
  type: 'sum' | 'answer'
  pairIndex: number
  display: string
}

const props = defineProps<{
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
  timersDisabled?: boolean
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const { t } = useI18n()

const pairCount = computed(() => {
  const p = props.difficultyParams?.pairCount ?? 3
  return Math.min(6, Math.max(2, p))
})

const timerSeconds = computed(() => {
  const s = props.difficultyParams?.timerSeconds ?? 45
  return Math.max(15, s)
})

const operandMin = computed(() => props.difficultyParams?.operandMin ?? 0)
const operandMax = computed(() => props.difficultyParams?.operandMax ?? 10)

/** Generate pairs: (a, b) -> answer = a+b. Each pair becomes sum card + answer card. */
const pairs = computed(() => {
  const seed =
    props.question.a +
    props.question.b * 100 +
    props.question.correctAnswer * 10000 +
    pairCount.value * 100000
  const rng = createSeededRng(seed)
  const range = operandMax.value - operandMin.value + 1
  const result: MemoryPair[] = []
  const used = new Set<number>()

  while (result.length < pairCount.value) {
    const a = operandMin.value + Math.floor(rng() * range)
    const b = operandMin.value + Math.floor(rng() * range)
    const answer = a + b
    if (!used.has(answer) && answer >= 0) {
      used.add(answer)
      result.push({ a, b, answer })
    }
  }
  return result
})

/** Cards: each pair contributes sum card + answer card. Shuffled. */
const cards = computed((): MemoryCard[] => {
  const items: MemoryCard[] = []
  pairs.value.forEach((p, i) => {
    items.push({
      id: `sum-${i}`,
      type: 'sum',
      pairIndex: i,
      display: `${p.a} + ${p.b}`,
    })
    items.push({
      id: `ans-${i}`,
      type: 'answer',
      pairIndex: i,
      display: String(pairs.value[i]!.answer),
    })
  })
  const seed =
    props.question.a +
    props.question.b * 100 +
    props.question.correctAnswer * 10000 +
    99999
  const rng = createSeededRng(seed)
  return items.sort(() => rng() - 0.5)
})

const flipped = ref<Set<number>>(new Set())
const matched = ref<Set<number>>(new Set())
const wrongPairTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const answered = ref(false)
const showSuccess = ref(false)
const successTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const timeLeft = ref(0)
let timerHandle: ReturnType<typeof setInterval> | null = null

const allMatched = computed(
  () => matched.value.size === pairCount.value && pairCount.value > 0
)

function startTimer() {
  if (props.timersDisabled || timerSeconds.value <= 0) return
  timeLeft.value = timerSeconds.value
  timerHandle = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      stopTimer()
      if (!answered.value) {
        answered.value = true
        emit('answer', props.question.correctAnswer)
      }
    }
  }, 1000)
}

function stopTimer() {
  if (timerHandle) {
    clearInterval(timerHandle)
    timerHandle = null
  }
}

function isFlipped(index: number): boolean {
  return flipped.value.has(index) || matched.value.has(cards.value[index]!.pairIndex)
}

function flipCard(index: number) {
  if (answered.value) return
  if (flipped.value.has(index)) return
  if (matched.value.has(cards.value[index]!.pairIndex)) return
  if (flipped.value.size >= 2) return

  flipped.value = new Set([...flipped.value, index])

  if (flipped.value.size === 2) {
    const [i1, i2] = [...flipped.value]
    const c1 = cards.value[i1]!
    const c2 = cards.value[i2]!
    if (c1.pairIndex === c2.pairIndex) {
      matched.value = new Set([...matched.value, c1.pairIndex])
      flipped.value = new Set()
      if (allMatched.value) {
        answered.value = true
        stopTimer()
        showSuccess.value = true
        successTimeout.value = setTimeout(() => {
          successTimeout.value = null
          emit('answer', props.question.correctAnswer)
        }, 600)
      }
    } else {
      wrongPairTimeout.value = setTimeout(() => {
        flipped.value = new Set()
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

function advanceImmediately() {
  if (successTimeout.value) {
    clearTimeout(successTimeout.value)
    successTimeout.value = null
  }
  emit('answer', props.question.correctAnswer)
}

watch(
  () => props.question,
  () => {
    flipped.value = new Set()
    matched.value = new Set()
    answered.value = false
    showSuccess.value = false
    if (wrongPairTimeout.value) {
      clearTimeout(wrongPairTimeout.value)
      wrongPairTimeout.value = null
    }
    if (successTimeout.value) {
      clearTimeout(successTimeout.value)
      successTimeout.value = null
    }
    stopTimer()
    startTimer()
  }
)

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
  if (wrongPairTimeout.value) clearTimeout(wrongPairTimeout.value)
  if (successTimeout.value) clearTimeout(successTimeout.value)
})
</script>

<template>
  <div
    class="memory-match-scene"
    data-testid="minigame-memory-match"
    role="group"
    :aria-label="t('minigameMemoryMatch.ariaLabel')"
  >
    <div
      v-if="timerSeconds > 0 && !timersDisabled"
      class="timer-bar"
      role="timer"
      :aria-label="t('modes.secondsRemaining', { remaining: timeLeft })"
    >
      <div class="timer-fill" :style="{ width: `${(timeLeft / timerSeconds) * 100}%` }" />
      <span class="timer-text">{{ timeLeft }}s</span>
    </div>

    <div class="cards-grid" role="group" aria-label="Kaarten">
      <button
        v-for="(card, idx) of cards"
        :key="card.id"
        class="card"
        :class="{ flipped: isFlipped(idx), matched: matched.has(card.pairIndex), answered }"
        :disabled="answered"
        :aria-label="isFlipped(idx) ? card.display : t('memoryMatch.cardBack')"
        tabindex="0"
        @click="flipCard(idx)"
        @keydown="handleKeydown($event, idx)"
      >
        <div class="card-inner">
          <div class="card-face card-back">
            <img :src="cardBackSrc" alt="" width="80" height="100" />
          </div>
          <div class="card-face card-front">
            <span class="card-text">{{ card.display }}</span>
          </div>
        </div>
      </button>
    </div>

    <Transition name="success-fade">
      <button
        v-if="showSuccess"
        type="button"
        class="success-pill"
        role="status"
        aria-live="polite"
        @click="advanceImmediately"
      >
        <span class="success-text">{{ t('memoryMatch.roundComplete') }}</span>
        <span class="success-hint">{{ t('memoryMatch.continueHint') }}</span>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.memory-match-scene {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  min-height: 260px;
}

.timer-bar {
  width: 100%;
  max-width: 300px;
  height: 24px;
  background: var(--app-surface, #fffde7);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.timer-fill {
  height: 100%;
  background: var(--app-primary, #00bcd4);
  border-radius: 12px;
  transition: width 1s linear;
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--app-font, sans-serif);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #01242b);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  max-width: 360px;
  width: 100%;
}

.card {
  width: 100%;
  aspect-ratio: 4/5;
  min-width: 48px;
  min-height: 60px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  border-radius: 8px;
  transition: transform 0.15s ease;
}

.card.matched {
  opacity: 0.6;
  pointer-events: none;
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

.card.flipped .card-inner,
.card.matched .card-inner {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-back {
  transform: rotateY(0deg);
  background: linear-gradient(135deg, #006064 0%, #00838f 100%);
}

.card-front {
  transform: rotateY(180deg);
  background: #ffffff;
  border: 3px solid var(--app-primary, #00bcd4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card.flipped .card-front,
.card.matched .card-front {
  border-color: var(--app-correct, #4caf50);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
}

.card-back img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--app-ink, #01242b);
  text-align: center;
  padding: 0.25rem;
}

.success-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid var(--app-correct, #4caf50);
  border-radius: 999px;
  cursor: pointer;
  font-family: var(--app-font, sans-serif);
  transition: background 0.15s ease;
}
.success-pill:hover {
  background: rgba(76, 175, 80, 0.3);
}

.success-text {
  font-size: 1rem;
  font-weight: 700;
  color: var(--app-correct, #2e7d32);
}

.success-hint {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--app-text-secondary, #546e7a);
}

.success-fade-enter-active,
.success-fade-leave-active {
  transition: opacity 0.2s ease;
}
.success-fade-enter-from,
.success-fade-leave-to {
  opacity: 0;
}
</style>
