<script setup lang="ts">
import type { SkinRoundProps } from '~/types/skin'
import { isCorrectFeedback, isTimeoutFeedback } from '~/utils/feedbackHelpers'

defineProps<SkinRoundProps>()
</script>

<template>
  <div class="monster-feed" role="main">
    <h1>Feed the Monster!</h1>
    <p class="monster" aria-hidden="true">🦖</p>

    <div
      v-if="question"
      class="question"
      role="group"
      :aria-label="`${question.a} plus ${question.b} equals ?`"
    >
      <p class="prompt">{{ question.a }} + {{ question.b }} = ?</p>
      <p class="hint">Pick the right number to feed the monster.</p>

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

    <div v-if="feedback" class="feedback" role="status" aria-live="polite">
      <p v-if="isCorrectFeedback(feedback) && feedback.correct" class="correct">Yum! The monster is happy! 🎉</p>
      <p v-else-if="isTimeoutFeedback(feedback)" class="incorrect">
        Time's up! The answer was {{ feedback.correctAnswer }}. Try again!
      </p>
      <p v-else class="incorrect">
        Oops! The answer was {{ question?.correctAnswer }}. Try again!
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
.monster-feed {
  max-width: 24rem;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, sans-serif;
  background: linear-gradient(to bottom, #e8f5e9, #fff);
  border-radius: 1rem;
}

h1 {
  margin-top: 0;
  font-size: 1.5rem;
  color: #2e7d32;
}

.monster {
  font-size: 3rem;
  margin: 0.5rem 0;
  text-align: center;
}

.question {
  margin: 1.5rem 0;
}

.prompt {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.hint {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.choice {
  min-width: 3.5rem;
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  border: 2px solid #2e7d32;
  border-radius: 0.5rem;
  background: #fff;
  cursor: pointer;
  color: #1b5e20;
}

.choice:hover:not(.disabled) {
  background: #c8e6c9;
}

.choice:focus-visible {
  outline: 2px solid #2e7d32;
  outline-offset: 2px;
}

.choice.disabled {
  cursor: default;
  opacity: 0.7;
}

.feedback {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
}

.feedback .correct {
  color: #0a0;
  font-weight: 600;
}

.feedback .incorrect {
  color: #c00;
}

.next {
  display: block;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #2e7d32;
  border-radius: 0.375rem;
  background: #fff;
  cursor: pointer;
}

.next:focus-visible {
  outline: 2px solid #2e7d32;
  outline-offset: 2px;
}

.stats {
  margin-top: 1rem;
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;
}
</style>
