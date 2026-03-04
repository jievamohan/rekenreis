<script setup lang="ts">
import type { SkinRoundProps } from '~/types/skin'
import { isCorrectFeedback, isTimeoutFeedback } from '~/utils/feedbackHelpers'

defineProps<SkinRoundProps>()
</script>

<template>
  <div class="skin-pirate" role="main">
    <h1>Pirate Math!</h1>
    <p class="theme" aria-hidden="true">🏴‍☠️</p>

    <div
      v-if="question"
      class="question"
      role="group"
      :aria-label="`${question.a} plus ${question.b} equals ?`"
    >
      <p class="prompt">{{ question.a }} + {{ question.b }} = ?</p>
      <p class="hint">Pick the treasure number!</p>

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
      <p v-if="isCorrectFeedback(feedback) && feedback.correct" class="correct">Ahoy! Correct! ⚓</p>
      <p v-else-if="isTimeoutFeedback(feedback)" class="incorrect">
        Time's up! The answer was {{ feedback.correctAnswer }}. Arrr!
      </p>
      <p v-else class="incorrect">
        The answer was {{ question?.correctAnswer }}. Arrr!
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

    <div class="mode">
      <label>
        <input
          :checked="mode === 'upTo10'"
          type="radio"
          name="skin-pirate-mode"
          value="upTo10"
          @change="onModeChange('upTo10')"
        />
        Up to 10
      </label>
      <label>
        <input
          :checked="mode === 'upTo20'"
          type="radio"
          name="skin-pirate-mode"
          value="upTo20"
          @change="onModeChange('upTo20')"
        />
        Up to 20
      </label>
    </div>
  </div>
</template>

<style scoped>
.skin-pirate {
  max-width: 24rem;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, sans-serif;
  background: linear-gradient(to bottom, #3e2723, #5d4037);
  color: #efebe9;
  border-radius: 1rem;
}

h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.theme {
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
  opacity: 0.9;
  margin-bottom: 1rem;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.choice {
  min-width: 44px;
  min-height: 44px;
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  border: 2px solid #8d6e63;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  color: var(--app-text);
}

.choice:hover:not(.disabled) {
  background: rgba(141, 110, 99, 0.5);
}

.choice:focus-visible {
  outline: 2px solid #ffd54f;
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
  color: #aed581;
  font-weight: 600;
}

.feedback .incorrect {
  color: #e57373;
}

.next {
  display: block;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #8d6e63;
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  color: var(--app-text);
}

.next:focus-visible {
  outline: 2px solid #ffd54f;
  outline-offset: 2px;
}

.stats {
  margin-top: 1rem;
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;
}

.mode {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.mode label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
}
</style>
