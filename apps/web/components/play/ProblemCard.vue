<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
withDefaults(
  defineProps<{
    a: number
    b: number
    answer: string
    isCorrect: boolean | null
    /** Minigame variant: subtler, integrated look for level play */
    variant?: 'default' | 'minigame'
  }>(),
  { variant: 'default' }
)
</script>

<template>
  <div
    class="problem-card"
    :class="[
      {
        'problem-correct': isCorrect === true && variant !== 'minigame',
        'problem-wrong': isCorrect === false && variant !== 'minigame',
      },
      variant === 'minigame' ? 'problem-card-minigame' : '',
    ]"
    role="group"
    :aria-label="t('problemCard.ariaLabel', { a, b, answer: answer || t('problemCard.blank') })"
  >
    <template v-if="variant === 'minigame'">
      <p class="minigame-challenge">{{ t('problemCard.rekenUit') }}</p>
      <div class="minigame-sum">
        <span class="minigame-bubble operand-bubble" data-testid="operand-a">{{ a }}</span>
        <span class="minigame-op" aria-hidden="true">+</span>
        <span class="minigame-bubble operand-bubble" data-testid="operand-b">{{ b }}</span>
        <span class="minigame-op" aria-hidden="true">=</span>
        <span class="minigame-bubble answer-bubble" :class="{ empty: !answer }">
          {{ answer || '?' }}
        </span>
      </div>
    </template>
    <template v-else>
      <span class="operand" data-testid="operand-a">{{ a }}</span>
      <span class="operator" aria-hidden="true">+</span>
      <span class="operand" data-testid="operand-b">{{ b }}</span>
      <span class="equals" aria-hidden="true">=</span>
      <span
        class="answer-display"
        :class="{ empty: !answer }"
        aria-live="polite"
      >{{ answer || '?' }}</span>
    </template>
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

/* Minigame variant: game challenge — distinct from classic quiz */
.problem-card-minigame {
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(178, 223, 219, 0.15) 100%);
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 1.25rem;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.minigame-challenge {
  margin: 0;
  font-family: var(--app-font);
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.02em;
}

.minigame-sum {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.minigame-bubble {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  min-height: 2.5rem;
  padding: 0.25rem 0.5rem;
  font-family: var(--app-font);
  font-size: 1.75rem;
  font-weight: 800;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff 0%, #e0f7fa 100%);
  color: #004d40;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.minigame-bubble.answer-bubble.empty {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(224, 247, 250, 0.3) 100%);
  color: rgba(0, 77, 64, 0.6);
  border: 2px dashed rgba(255, 255, 255, 0.6);
}

.minigame-op {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
