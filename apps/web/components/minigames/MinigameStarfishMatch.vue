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
const timerSeconds = computed(() => props.difficultyParams?.timerSeconds ?? 20)
const timeLeft = ref(timerSeconds.value)
let timerHandle: ReturnType<typeof setInterval> | null = null
const answered = ref(false)
const selectedStar = ref<number | null>(null)

const stars = computed(() =>
  props.question.choices.map((choice) => ({ value: choice }))
)

function selectStar(value: number) {
  if (answered.value) return
  if (selectedStar.value === value) {
    selectedStar.value = null
    return
  }
  selectedStar.value = value
  answered.value = true
  stopTimer()
  emit('answer', value)
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

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div
    class="starfish-match-scene"
    data-testid="minigame-starfish-match"
    role="group"
    :aria-label="t('problemCard.ariaLabel', { a: question.a, b: question.b, answer: question.correctAnswer })"
  >
    <div class="timer-bar" role="timer" :aria-label="t('modes.secondsRemaining', { remaining: timeLeft })">
      <div class="timer-fill" :style="{ width: `${(timeLeft / timerSeconds) * 100}%` }" />
      <span class="timer-text">{{ timeLeft }}s</span>
    </div>

    <div class="stars-grid" role="group" aria-label="Zeesterren">
      <button
        v-for="star in stars"
        :key="star.value"
        class="starfish"
        :class="{ selected: selectedStar === star.value, answered }"
        :disabled="answered"
        :aria-label="String(star.value)"
        @click="selectStar(star.value)"
      >
        <span class="star-number">{{ star.value }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.starfish-match-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  min-height: 260px;
}

.timer-bar {
  width: 100%;
  max-width: 300px;
  height: 24px;
  background: var(--app-surface, #fffde7);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.timer-fill {
  height: 100%;
  background: #ffd54f;
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
  color: var(--app-text-on-surface, #f57f17);
}

.stars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  gap: 0.75rem;
  max-width: 320px;
  width: 100%;
  justify-items: center;
}

.starfish {
  width: 64px;
  height: 64px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  border: 2px solid #ffd54f;
  background: linear-gradient(135deg, #fff9c4, #fff176);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.starfish:hover:not(:disabled),
.starfish:focus-visible {
  transform: scale(1.1);
  box-shadow: 0 0 16px rgba(255, 213, 79, 0.6);
}

.starfish:focus-visible {
  outline: 2px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.starfish.selected {
  border-color: var(--app-correct, #66bb6a);
  box-shadow: 0 0 20px rgba(102, 187, 106, 0.5);
  animation: match-glow 0.3s ease-out;
}

.starfish:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.star-number {
  font-family: var(--app-font, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: #f57f17;
  pointer-events: none;
}

@keyframes match-glow {
  0% { box-shadow: 0 0 0 rgba(102, 187, 106, 0); }
  50% { box-shadow: 0 0 24px rgba(102, 187, 106, 0.7); }
  100% { box-shadow: 0 0 20px rgba(102, 187, 106, 0.5); }
}

@media (prefers-reduced-motion: reduce) {
  .starfish {
    transition: none;
  }
  .starfish.selected {
    animation: none;
  }
}
</style>
