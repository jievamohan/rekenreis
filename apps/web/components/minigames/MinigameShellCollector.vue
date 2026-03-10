<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import { useI18n } from '~/composables/useI18n'

import creatureSrc from '~/assets/graphics/minigames/shell-collector/creature.svg'
import shellSrc from '~/assets/graphics/minigames/shell-collector/shell.svg'

const props = defineProps<{
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const { t } = useI18n()

const shellCount = ref(props.question.a)
const answered = ref(false)
const overtapShake = ref(false)
const targetCount = computed(() => props.question.correctAnswer)

function addShell() {
  if (answered.value) {
    overtapShake.value = true
    setTimeout(() => { overtapShake.value = false }, 250)
    return
  }
  shellCount.value += 1
  if (shellCount.value >= targetCount.value) {
    answered.value = true
    emit('answer', props.question.correctAnswer)
  }
}

function onAddKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    addShell()
  }
}

watch(
  () => props.question,
  (q) => {
    shellCount.value = q.a
    answered.value = false
    overtapShake.value = false
  }
)
</script>

<template>
  <div
    class="shell-collector-scene"
    data-testid="minigame-shell-collector"
    role="group"
    :aria-label="t('minigameShellCollector.ariaLabel', { a: question.a, b: question.b, target: question.correctAnswer })"
    :aria-live="answered ? 'off' : 'polite'"
  >
    <div class="creature-zone">
      <img
        :src="creatureSrc"
        alt=""
        class="creature"
        aria-hidden="true"
      >
      <div class="shells-row" aria-hidden="true">
        <img
          v-for="i in Math.min(shellCount, targetCount)"
          :key="i"
          :src="shellSrc"
          alt=""
          class="shell"
        >
      </div>
      <div
        class="count-display"
        role="status"
        :aria-label="t('minigameShellCollector.countLabel', { count: shellCount, target: targetCount })"
      >
        {{ shellCount }} / {{ targetCount }}
      </div>
    </div>

    <button
      type="button"
      class="add-shell-btn"
      :class="{ shake: overtapShake }"
      :disabled="answered"
      :aria-label="t('minigameShellCollector.addShellLabel')"
      @click="addShell"
      @keydown="onAddKeydown"
    >
      {{ t('minigameShellCollector.addShell') }}
    </button>
  </div>
</template>

<style scoped>
.shell-collector-scene {
  width: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
}

.creature-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.creature {
  width: 96px;
  height: 77px;
  object-fit: contain;
}

.shells-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  min-height: 32px;
}

.shell {
  width: 32px;
  height: 24px;
  object-fit: contain;
  animation: shell-pop 150ms ease-out;
}

@keyframes shell-pop {
  from {
    transform: scale(0);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.count-display {
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #1a237e);
  min-height: 24px;
}

.add-shell-btn {
  min-width: 120px;
  min-height: 48px;
  padding: 0.75rem 1.5rem;
  font-family: var(--app-font, sans-serif);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--app-text-on-primary, #fff);
  background: var(--app-primary, #00897b);
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
}

.add-shell-btn:hover:not(:disabled) {
  background: var(--app-primary-hover, #00695c);
  transform: scale(1.02);
}

.add-shell-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.add-shell-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.add-shell-btn:focus-visible {
  outline: 3px solid var(--app-focus, #ff9800);
  outline-offset: 2px;
}

.add-shell-btn.shake {
  animation: overtap-shake 250ms ease-in-out;
}

@keyframes overtap-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

@media (prefers-reduced-motion: reduce) {
  .shell {
    animation: none;
  }
  .add-shell-btn.shake {
    animation: none;
  }
}
</style>
