<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const timerSeconds = computed(() => props.difficultyParams?.timerSeconds ?? 15)
const timeLeft = ref(timerSeconds.value)
let timerHandle: ReturnType<typeof setInterval> | null = null
const answered = ref(false)

const pellets = computed(() =>
  props.question.choices.map((choice, i) => ({
    value: choice,
    offset: (i * 22) % 80 + 10,
    delay: i * 0.3,
  }))
)

function selectPellet(choice: number) {
  if (answered.value) return
  answered.value = true
  stopTimer()
  emit('answer', choice)
}

function startTimer() {
  timeLeft.value = timerSeconds.value
  timerHandle = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      stopTimer()
      if (!answered.value) {
        answered.value = true
        emit('answer', -1)
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

const prefersReducedMotion = ref(false)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div
    class="fish-feed-scene"
    data-testid="minigame-fish-feed"
    role="group"
    :aria-label="t('problemCard.ariaLabel', { a: question.a, b: question.b, answer: question.correctAnswer })"
  >
    <div class="timer-bar" role="timer" :aria-label="t('modes.secondsRemaining', { remaining: timeLeft })">
      <div class="timer-fill" :style="{ width: `${(timeLeft / timerSeconds) * 100}%` }" />
      <span class="timer-text">{{ timeLeft }}s</span>
    </div>

    <div class="fish-area" aria-hidden="true">
      <span class="fish-emoji">🐟</span>
    </div>

    <div class="pellets-row" role="group" aria-label="Korrels">
      <button
        v-for="pellet in pellets"
        :key="pellet.value"
        class="pellet"
        :class="{ 'pellet-animate': !prefersReducedMotion }"
        :style="{ '--delay': `${pellet.delay}s` }"
        :disabled="answered"
        :aria-label="String(pellet.value)"
        @click="selectPellet(pellet.value)"
      >
        <span class="pellet-number">{{ pellet.value }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.fish-feed-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  min-height: 280px;
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
  background: var(--app-correct, #66bb6a);
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
  color: var(--app-text-on-surface, #1a237e);
}

.fish-area {
  font-size: 3rem;
  animation: fish-swim 2s ease-in-out infinite;
}

.pellets-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.pellet {
  width: 56px;
  height: 56px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  border: 2px solid var(--app-correct, #66bb6a);
  background: linear-gradient(135deg, #c8e6c9, #a5d6a7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.pellet:hover:not(:disabled),
.pellet:focus-visible {
  transform: scale(1.1);
}

.pellet:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.pellet:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pellet-animate {
  animation: pellet-drop 0.4s ease-out;
  animation-delay: var(--delay, 0s);
  animation-fill-mode: backwards;
}

.pellet-number {
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #1b5e20);
  pointer-events: none;
}

@keyframes fish-swim {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

@keyframes pellet-drop {
  from { transform: translateY(-40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .fish-area {
    animation: none;
  }
  .pellet-animate {
    animation: none;
  }
}
</style>
