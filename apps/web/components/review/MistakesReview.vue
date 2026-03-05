<script setup lang="ts">
import type { MistakeItem } from '~/composables/useMistakes'
import mascotSrc from '~/assets/graphics/characters/mascot.svg'
import HintDots from '~/components/hints/HintDots.vue'

defineProps<{
  mistakes: MistakeItem[]
  level: number
}>()

defineEmits<{
  retry: []
  backToMap: []
}>()
</script>

<template>
  <div class="mistakes-review">
    <div class="review-header">
      <img :src="mascotSrc" alt="" class="review-mascot" aria-hidden="true" />
      <h2 class="review-title">Laten we deze nog eens bekijken!</h2>
      <p class="review-subtitle">Level {{ level }} — {{ mistakes.length }} to review</p>
    </div>

    <div class="cards-container" role="list" aria-label="Mistakes to review">
      <div
        v-for="(m, idx) in mistakes"
        :key="idx"
        class="mistake-card"
        :style="{ '--stagger': `${idx * 100}ms` }"
        role="listitem"
      >
        <div class="problem-row">
          <span class="problem-text">{{ m.a }} + {{ m.b }} = ?</span>
        </div>
        <div class="answer-row">
          <span class="your-answer">
            Your answer: <strong>{{ m.selectedAnswer }}</strong>
          </span>
          <span class="correct-answer">
            Correct: <strong>{{ m.correctAnswer }}</strong>
          </span>
        </div>
        <HintDots
          :a="m.a"
          :b="m.b"
          :correct-answer="m.correctAnswer"
        />
      </div>
    </div>

    <div class="review-actions">
      <button type="button" class="cta-primary" @click="$emit('retry')">
        Opnieuw proberen
      </button>
      <button type="button" class="cta-secondary" @click="$emit('backToMap')">
        Naar de kaart
      </button>
    </div>
  </div>
</template>

<style scoped>
.mistakes-review {
  display: flex;
  flex-direction: column;
  gap: var(--app-space-lg);
  max-width: 480px;
  margin: 0 auto;
  padding: var(--app-space-md);
}

.review-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--app-space-sm);
}

.review-mascot {
  width: 64px;
  height: 64px;
}

.review-title {
  font-family: var(--app-font);
  font-size: var(--app-font-size-xl);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  margin: 0;
}

.review-subtitle {
  font-family: var(--app-font);
  font-size: var(--app-font-size-md);
  color: var(--app-text-muted-on-surface);
  margin: 0;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: var(--app-space-md);
}

.mistake-card {
  background: var(--app-surface);
  border-radius: var(--app-radius-md);
  padding: var(--app-space-md);
  box-shadow: var(--app-shadow-sm);
  border-left: 4px solid var(--app-primary);
}

@media (prefers-reduced-motion: no-preference) {
  .mistake-card {
    animation: slide-in 0.3s ease-out both;
    animation-delay: var(--stagger);
  }
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(-16px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.problem-row {
  margin-bottom: var(--app-space-sm);
}

.problem-text {
  font-family: var(--app-font);
  font-size: var(--app-font-size-xl);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
}

.answer-row {
  display: flex;
  gap: var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-md);
  color: var(--app-text-muted-on-surface);
  flex-wrap: wrap;
}

.your-answer strong {
  color: var(--app-wrong);
}

.correct-answer strong {
  color: var(--app-correct);
}

.review-actions {
  display: flex;
  flex-direction: column;
  gap: var(--app-space-sm);
}

.cta-primary {
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-cta);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  background: var(--app-primary);
  border: none;
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: background var(--app-transition);
}

.cta-primary:hover {
  background: var(--app-primary-hover);
}

.cta-primary:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.cta-secondary {
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-primary);
  background: transparent;
  border: 2px solid var(--app-primary);
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: background var(--app-transition);
}

.cta-secondary:hover {
  background: rgba(0, 188, 212, 0.1);
}

.cta-secondary:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
</style>
