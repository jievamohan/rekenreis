<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { SkinRoundProps } from '~/types/skin'
import type { SkinId } from '~/utils/skinResolver'
import { useSkin } from '~/composables/useSkin'
import { isCorrectFeedback, isTimeoutFeedback } from '~/utils/feedbackHelpers'

const props = defineProps<
  SkinRoundProps & { effectiveSkinId: SkinId; recordTimeout: () => void }
>()

const DEFAULT_TIMER_SECONDS = 15
const timerSeconds = DEFAULT_TIMER_SECONDS
const elapsed = ref(0)
const timerId = ref<ReturnType<typeof setInterval> | null>(null)
const skin = useSkin(props.effectiveSkinId)
const skinProps = {
  question: props.question,
  feedback: props.feedback,
  score: props.score,
  streak: props.streak,
  mode: props.mode,
  onAnswer: props.onAnswer,
  onNext: props.onNext,
  onModeChange: props.onModeChange,
}

function startTimer() {
  stopTimer()
  elapsed.value = 0
  if (import.meta.client) {
    timerId.value = setInterval(() => {
      elapsed.value += 1
      if (elapsed.value >= timerSeconds) {
        stopTimer()
        props.recordTimeout()
      }
    }, 1000)
  }
}

function stopTimer() {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
}

watch(
  () => props.question,
  (q) => {
    if (q && !props.feedback) startTimer()
    else stopTimer()
  },
  { immediate: true }
)

watch(
  () => props.feedback,
  (fb) => {
    if (fb) stopTimer()
  },
  { immediate: true }
)

onUnmounted(stopTimer)

const remaining = computed(() => Math.max(0, timerSeconds - elapsed.value))
const displayTime = computed(() => {
  const s = remaining.value
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})
const hasFeedback = computed(() => !!props.feedback)
</script>

<template>
  <div class="mode-timed-pop" role="main">
    <div v-if="question" class="question" role="group" :aria-label="`${question.a} plus ${question.b} equals ?`">
      <p class="prompt">{{ question.a }} + {{ question.b }} = ?</p>
      <p v-if="!hasFeedback" class="timer" role="timer" :aria-label="`${remaining} seconds remaining`">
        {{ displayTime }}
      </p>
      <div class="choices" role="group" aria-label="Answer choices">
        <button
          v-for="(choice, i) in question.choices"
          :key="`${choice}-${i}`"
          type="button"
          class="choice"
          :class="{ disabled: !!feedback }"
          :disabled="!!feedback"
          :tabindex="feedback ? -1 : 0"
          @click="onAnswer(choice)"
          @keydown.enter.prevent="onAnswer(choice)"
          @keydown.space.prevent="onAnswer(choice)"
        >
          {{ choice }}
        </button>
      </div>
    </div>

    <div
      v-if="feedback"
      class="feedback"
      :class="isCorrectFeedback(feedback) && feedback.correct ? 'feedback-correct' : 'feedback-incorrect'"
      role="status"
      aria-live="polite"
    >
      <p v-if="isCorrectFeedback(feedback) && feedback.correct" class="correct">Correct!</p>
      <p v-else-if="isTimeoutFeedback(feedback)" class="incorrect">
        Time's up! The answer was {{ feedback.correctAnswer }}.
      </p>
      <p v-else class="incorrect">
        Not quite. The answer was {{ question?.correctAnswer }}.
      </p>
      <button
        type="button"
        class="next"
        @click="onNext"
        @keydown.enter.prevent="onNext"
        @keydown.space.prevent="onNext"
      >
        Next
      </button>
    </div>

    <div class="stats" role="status">
      <span>Score: {{ score }}</span>
      <span>Streak: {{ streak }}</span>
    </div>
  </div>
</template>

<style scoped>
.mode-timed-pop {
  max-width: 24rem;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, sans-serif;
}
.question {
  margin: 1.5rem 0;
}
.prompt {
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
}
.timer {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #06c;
}
.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
.choice {
  padding: 0.75rem 1.25rem;
  font-size: 1.125rem;
  border: 2px solid #ccc;
  border-radius: 0.5rem;
  background: #fff;
  cursor: pointer;
}
.choice:hover:not(:disabled) {
  background: #f0f0f0;
}
.choice:focus-visible {
  outline: 2px solid #06c;
  outline-offset: 2px;
}
.choice.disabled {
  cursor: default;
  opacity: 0.7;
}
.feedback {
  margin-top: 1rem;
}

.feedback-correct {
  animation: feedback-bounce 0.25s ease-out;
}

.feedback-incorrect {
  animation: feedback-shake 0.25s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .feedback-correct,
  .feedback-incorrect {
    animation: none;
  }
}

@keyframes feedback-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

@keyframes feedback-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.feedback .correct {
  color: #080;
}
.feedback .incorrect {
  color: #800;
}
.next {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
.next:focus-visible {
  outline: 2px solid #06c;
  outline-offset: 2px;
}
.stats {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}
</style>
