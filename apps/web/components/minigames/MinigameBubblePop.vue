<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import { useI18n } from '~/composables/useI18n'
import { createSeededRng } from '~/utils/seedableRng'

const props = defineProps<{
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
  timersDisabled?: boolean
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const { t } = useI18n()

const bubbleCount = computed(() => props.difficultyParams?.bubbleCount ?? 6)
const timerSeconds = computed(() => props.difficultyParams?.timerSeconds ?? 0)
const timeLeft = ref(0)
let timerHandle: ReturnType<typeof setInterval> | null = null
const answered = ref(false)

/** Expand choices to bubbleCount with extra distractors if needed */
function expandChoices(q: AdditionQuestion, target: number): number[] {
  const existing = new Set(q.choices)
  if (existing.size >= target) return [...q.choices].slice(0, target)
  const rng = createSeededRng(q.a + q.b * 100 + q.correctAnswer * 10000)
  const result = [...q.choices]
  const maxVal = Math.max(q.a + q.b + 10, 20)
  for (let attempts = 0; result.length < target && attempts < 200; attempts++) {
    const offset = Math.floor(rng() * 17) - 8
    const val = q.correctAnswer + offset
    if (val >= 0 && val <= maxVal && !existing.has(val)) {
      existing.add(val)
      result.push(val)
    }
  }
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const choicesToShow = computed(() =>
  expandChoices(props.question, bubbleCount.value)
)

/** Per-value variation: each number gets its own bounce (faster/slower, higher/lower) */
function getBubbleParams(value: number, index: number, total: number) {
  const v = Math.abs(value)
  const seed = v * 11 + index
  const slotWidth = 78 / Math.max(total, 3)
  const baseLeft = 10 + index * slotWidth
  const wiggle = ((seed % 5) - 2) * 1.5
  const left = Math.max(8, Math.min(86, baseLeft + wiggle))
  return {
    value,
    delay: index * 0.12,
    left,
    duration: 2.1 + (seed % 8) * 0.4,
    height: 80 + (seed % 10) * 11,
  }
}

const bubbles = computed(() =>
  choicesToShow.value.map((c, i) => getBubbleParams(c, i, choicesToShow.value.length))
)

function selectBubble(choice: number) {
  if (answered.value) return
  answered.value = true
  stopTimer()
  emit('answer', choice)
}

function startTimer() {
  if (timerSeconds.value <= 0) return
  timeLeft.value = timerSeconds.value
  timerHandle = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      stopTimer()
      if (!answered.value) {
        answered.value = true
        const wrong = props.question.choices.find((c) => c !== props.question.correctAnswer)
        emit('answer', wrong ?? -1)
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

const timerFraction = computed(() =>
  timerSeconds.value > 0 ? Math.max(0, timeLeft.value / timerSeconds.value) : 1
)

const timerColor = computed(() => {
  if (timerFraction.value > 0.5) return 'var(--app-correct, #66bb6a)'
  if (timerFraction.value > 0.25) return 'var(--app-warning, #ffa726)'
  return 'var(--app-wrong, #ef5350)'
})

onMounted(() => {
  if (!props.timersDisabled && timerSeconds.value > 0) startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div
    class="bubble-pop-scene"
    data-testid="minigame-bubble-pop"
    role="group"
    :aria-label="t('problemCard.ariaLabel', { a: question.a, b: question.b, answer: question.correctAnswer })"
  >
    <div
      v-if="timerSeconds > 0 && !timersDisabled"
      class="timer-bar"
      role="timer"
      :aria-label="t('modes.secondsRemaining', { remaining: timeLeft })"
    >
      <div
        class="timer-fill"
        :style="{
          width: `${timerFraction * 100}%`,
          background: timerColor,
        }"
      />
      <span class="timer-text">{{ timeLeft }}s</span>
    </div>

    <div class="bubble-field">
      <button
        v-for="(bubble, i) in bubbles"
        :key="`${bubble.value}-${i}`"
        class="bubble"
        :style="{
          '--float-delay': `${bubble.delay}s`,
          '--float-duration': `${bubble.duration}s`,
          '--float-height': `${bubble.height}px`,
          '--left': `${bubble.left}%`,
        }"
        :disabled="answered"
        :aria-label="String(bubble.value)"
        @click="selectBubble(bubble.value)"
      >
        <span class="bubble-inner">
          <span class="bubble-number">{{ bubble.value }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.bubble-pop-scene {
  width: 100%;
  position: relative;
  min-height: 280px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.timer-bar {
  width: 100%;
  max-width: 300px;
  height: 24px;
  background: var(--app-surface, #e0f2f1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.timer-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 1s linear, background 0.5s ease;
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--app-font, sans-serif);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #1a237e);
}

.bubble-field {
  position: relative;
  width: 100%;
  height: 280px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
}

.bubble {
  position: absolute;
  bottom: 0;
  left: var(--left, 25%);
  width: 64px;
  height: 64px;
  min-width: 48px;
  min-height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  /* Float-up stays on button so hit area never jumps - pop is on inner only */
  transform-origin: 50% 100%;
  animation: float-up var(--float-duration, 3s) infinite;
  animation-delay: var(--float-delay, 0s);
  transition: transform 0.15s ease;
}

.bubble-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--app-primary, #4fc3f7);
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.6), var(--app-surface, #b3e5fc));
  display: flex;
  align-items: center;
  justify-content: center;
}

.bubble:hover .bubble-inner,
.bubble:focus-visible .bubble-inner {
  border-color: var(--app-correct, #66bb6a);
}

/* Scale on hover - animation's transform takes precedence when floating */
.bubble:hover,
.bubble:focus-visible {
  transform: scale(1.15);
}

.bubble:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 4px;
}

/* Pop only on inner - button keeps float-up so position never jumps, click always registers */
.bubble:active .bubble-inner {
  animation: pop 0.3s ease-out forwards;
}

.bubble-number {
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #1a237e);
  pointer-events: none;
}

@keyframes float-up {
  /* Position: bottom so hit area follows (avoids WebKit transform hit-test bug) */
  /* Squash at bottom (flatten, stretch horizontal), stretch at top (vertical) */
  /* Ease-out on ascent, ease-in on descent for natural bounce feel */
  0% {
    bottom: 0;
    transform: scaleX(1.12) scaleY(0.88);
    transform-origin: 50% 100%;
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1); /* ease-out */
  }
  50% {
    bottom: var(--float-height, 120px);
    transform: scaleX(0.96) scaleY(1.1);
    transform-origin: 50% 50%;
    animation-timing-function: cubic-bezier(0.32, 0, 0.67, 0); /* ease-in */
  }
  100% {
    bottom: 0;
    transform: scaleX(1.12) scaleY(0.88);
    transform-origin: 50% 100%;
  }
}

@keyframes pop {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
  100% { transform: scale(0); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .bubble {
    animation: none;
  }
  .bubble:active .bubble-inner {
    animation: none;
    transform: scale(0.9);
  }
}
</style>
