<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
defineProps<{
  a: number
  b: number
  answer: string
  isCorrect: boolean | null
}>()
</script>

<template>
  <div
    class="problem-card"
    :class="{
      'problem-correct': isCorrect === true,
      'problem-wrong': isCorrect === false,
    }"
    role="group"
    :aria-label="t('problemCard.ariaLabel', { a, b, answer: answer || t('problemCard.blank') })"
  >
    <span class="operand">{{ a }}</span>
    <span class="operator" aria-hidden="true">+</span>
    <span class="operand">{{ b }}</span>
    <span class="equals" aria-hidden="true">=</span>
    <span
      class="answer-display"
      :class="{ empty: !answer }"
      aria-live="polite"
    >{{ answer || '?' }}</span>
  </div>
</template>

<style scoped>
.problem-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--app-space-md);
  padding: var(--app-space-lg) var(--app-space-md);
  background: var(--app-surface);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow-md);
  transition: background var(--app-transition), box-shadow var(--app-transition);
}

.problem-correct {
  background: rgba(76, 175, 80, 0.12);
  box-shadow: 0 0 0 3px var(--app-correct), var(--app-shadow-md);
}

.problem-wrong {
  background: rgba(229, 57, 53, 0.08);
  box-shadow: 0 0 0 3px var(--app-wrong), var(--app-shadow-md);
}

@media (prefers-reduced-motion: no-preference) {
  .problem-correct {
    animation: card-bounce 0.3s ease-out;
  }
  .problem-wrong {
    animation: card-shake 0.3s ease-out;
  }
}

@keyframes card-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes card-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.operand,
.operator,
.equals {
  font-family: var(--app-font);
  font-size: var(--app-font-size-problem);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
}

.answer-display {
  font-family: var(--app-font);
  font-size: var(--app-font-size-problem);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-primary);
  min-width: 2ch;
  text-align: center;
  border-bottom: 3px solid var(--app-primary);
  padding: 0 var(--app-space-xs);
}

.answer-display.empty {
  color: var(--app-text-muted-on-surface);
  border-color: var(--app-text-muted-on-surface);
}
</style>
