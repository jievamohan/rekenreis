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
const showingHint = ref(false)
const prefersReducedMotion = ref(false)

const pellets = computed(() =>
  props.question.choices.map((choice, i) => ({
    value: choice,
    delay: i * 0.3,
  }))
)

function selectPellet(choice: number) {
  if (answered.value || showingHint.value) return
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
        onTimeout()
      }
    }
  }, 1000)
}

function onTimeout() {
  showingHint.value = true
  setTimeout(() => {
    if (!answered.value) {
      answered.value = true
      emit('answer', props.question.correctAnswer)
    }
  }, 2500)
}

function stopTimer() {
  if (timerHandle) {
    clearInterval(timerHandle)
    timerHandle = null
  }
}

const timerFraction = computed(() =>
  Math.max(0, timeLeft.value / timerSeconds.value)
)

const timerColor = computed(() => {
  if (timerFraction.value > 0.5) return 'var(--app-correct, #66bb6a)'
  if (timerFraction.value > 0.25) return 'var(--app-warning, #ffa726)'
  return 'var(--app-wrong, #ef5350)'
})

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
    :aria-label="t('minigameFishFeed.ariaLabel')"
  >
    <div class="timer-bar" role="timer" :aria-label="t('minigameFishFeed.timerLabel', { seconds: timeLeft })">
      <div
        class="timer-fill"
        :style="{ width: `${timerFraction * 100}%`, background: timerColor }"
      />
      <span class="timer-text">{{ timeLeft }}s</span>
    </div>

    <div class="fish-area" aria-hidden="true">
      <span class="fish-emoji" :class="{ 'fish-waiting': !showingHint }">🐟</span>
    </div>

    <div
      v-if="showingHint"
      class="hint-overlay"
      role="status"
      aria-live="polite"
    >
      <div class="hint-card">
        <span class="hint-icon" aria-hidden="true">💡</span>
        <p class="hint-text">
          {{ t('minigameFishFeed.hintMessage', { answer: question.correctAnswer }) }}
        </p>
        <p class="hint-continue">
          {{ t('minigameFishFeed.hintContinue') }}
        </p>
      </div>
    </div>

    <div v-else class="pellets-row" role="group" :aria-label="t('minigameFishFeed.pelletLabel', { value: '' })">
      <button
        v-for="pellet in pellets"
        :key="pellet.value"
        class="pellet"
        :class="{ 'pellet-animate': !prefersReducedMotion }"
        :style="{ '--delay': `${pellet.delay}s` }"
        :disabled="answered"
        :aria-label="t('minigameFishFeed.pelletLabel', { value: pellet.value })"
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

.fish-area {
  font-size: 3rem;
}

.fish-waiting {
  animation: fish-swim 2s ease-in-out infinite;
}

.pellets-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.pellet {
  width: 60px;
  height: 60px;
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
  outline: 3px solid var(--app-primary, #4fc3f7);
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

.hint-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: hint-fade-in 0.4s ease-out;
}

.hint-card {
  background: var(--app-surface-glass, rgba(255, 255, 255, 0.15));
  backdrop-filter: blur(8px);
  border: 2px solid var(--app-primary, #4fc3f7);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  text-align: center;
  max-width: 280px;
}

.hint-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.hint-text {
  font-family: var(--app-font, sans-serif);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--app-text-primary, #e0f7fa);
  margin: 0 0 0.5rem 0;
}

.hint-continue {
  font-family: var(--app-font, sans-serif);
  font-size: 0.85rem;
  color: var(--app-text-muted, #b0bec5);
  margin: 0;
}

@keyframes fish-swim {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

@keyframes pellet-drop {
  from { transform: translateY(-40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes hint-fade-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .fish-waiting {
    animation: none;
  }
  .pellet-animate {
    animation: none;
  }
  .hint-overlay {
    animation: none;
  }
}
</style>
