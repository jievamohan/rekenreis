<script setup lang="ts">
import { computed } from 'vue'
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

const bubbles = computed(() => {
  return props.question.choices.map((choice, i) => ({
    value: choice,
    delay: i * 0.4,
    left: 15 + (i * 20) % 70,
  }))
})

function selectBubble(choice: number) {
  emit('answer', choice)
}
</script>

<template>
  <div
    class="bubble-pop-scene"
    data-testid="minigame-bubble-pop"
    role="group"
    :aria-label="t('problemCard.ariaLabel', { a: question.a, b: question.b, answer: question.correctAnswer })"
  >
    <div class="bubble-field">
      <button
        v-for="bubble in bubbles"
        :key="bubble.value"
        class="bubble"
        :style="{
          '--delay': `${bubble.delay}s`,
          '--left': `${bubble.left}%`,
        }"
        :aria-label="String(bubble.value)"
        @click="selectBubble(bubble.value)"
      >
        <span class="bubble-number">{{ bubble.value }}</span>
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
  border-radius: 50%;
  border: 2px solid var(--app-primary, #4fc3f7);
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.6), var(--app-surface, #b3e5fc));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float-up 3s ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  transition: transform 0.15s ease;
}

.bubble:hover,
.bubble:focus-visible {
  transform: scale(1.15);
  border-color: var(--app-correct, #66bb6a);
}

.bubble:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 4px;
}

.bubble:active {
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
  0% { transform: translateY(0); }
  50% { transform: translateY(-120px); }
  100% { transform: translateY(0); }
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
  .bubble:active {
    animation: none;
    transform: scale(0.9);
  }
}
</style>
