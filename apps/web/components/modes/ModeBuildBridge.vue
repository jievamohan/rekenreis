<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SkinRoundProps } from '~/types/skin'
import type { SkinId } from '~/utils/skinResolver'
import { isCorrectFeedback, isTimeoutFeedback } from '~/utils/feedbackHelpers'

const props = defineProps<
  SkinRoundProps & { effectiveSkinId: SkinId; recordTimeout?: () => void }
>()

const selectedPlank = ref<number | null>(null)

const hasFeedback = computed(() => !!props.feedback)

function handlePlankSelect(choice: number) {
  if (props.feedback) return
  if (selectedPlank.value === choice) {
    props.onAnswer(choice)
    selectedPlank.value = null
  } else {
    selectedPlank.value = choice
  }
}

function handlePlace() {
  if (props.feedback || selectedPlank.value === null) return
  props.onAnswer(selectedPlank.value)
  selectedPlank.value = null
}

function handleDragStart(e: DragEvent, choice: number) {
  if (props.feedback) return
  e.dataTransfer?.setData('text/plain', String(choice))
  e.dataTransfer!.effectAllowed = 'move'
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  if (props.feedback) return
  const raw = e.dataTransfer?.getData('text/plain')
  if (!raw) return
  const choice = parseInt(raw, 10)
  if (Number.isNaN(choice)) return
  props.onAnswer(choice)
  selectedPlank.value = null
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
}
</script>

<template>
  <div class="mode-build-bridge" role="main">
    <div v-if="question" class="bridge-scene" role="group" :aria-label="`${question.a} plus ${question.b} equals ?`">
      <p class="prompt">{{ question.a }} + {{ question.b }} = ?</p>

      <div class="bridge-visual">
        <div class="bridge-left" aria-hidden="true" />
        <div
          class="bridge-gap"
          role="button"
          tabindex="0"
          :aria-label="selectedPlank !== null ? `Place plank ${selectedPlank} here` : 'Drop zone for answer plank'"
          :class="{ 'has-selection': selectedPlank !== null }"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @click="handlePlace"
          @keydown.enter.prevent="handlePlace"
          @keydown.space.prevent="handlePlace"
        >
          <span v-if="selectedPlank !== null" class="slot-preview">{{ selectedPlank }}</span>
          <span v-else class="slot-hint">?</span>
        </div>
        <div class="bridge-right" aria-hidden="true" />
      </div>

      <div class="planks" role="group" aria-label="Answer planks">
        <button
          v-for="(choice, i) in question.choices"
          :key="`${choice}-${i}`"
          type="button"
          class="plank"
          :class="{ selected: selectedPlank === choice }"
          :disabled="!!feedback"
          draggable="true"
          :aria-label="`Plank ${choice}${selectedPlank === choice ? ', selected, click drop zone to place' : ', click to select or drag to place'}`"
          @click="handlePlankSelect(choice)"
          @keydown.enter.prevent="handlePlankSelect(choice)"
          @keydown.space.prevent="handlePlankSelect(choice)"
          @dragstart="handleDragStart($event, choice)"
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
      <p v-if="isCorrectFeedback(feedback) && feedback.correct" class="correct">Correct!</p>
      <p v-else-if="isTimeoutFeedback(feedback)" class="info">
        Time's up! The answer was {{ feedback.correctAnswer }}.
      </p>
      <p v-else class="hint">
        Try another! The answer was {{ question?.correctAnswer }}.
      </p>
      <button
        type="button"
        class="next"
        @click="props.onNext"
        @keydown.enter.prevent="props.onNext"
        @keydown.space.prevent="props.onNext"
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
.mode-build-bridge {
  max-width: 24rem;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, sans-serif;
}
.bridge-scene {
  margin: 1.5rem 0;
}
.prompt {
  font-size: 1.25rem;
  margin: 0 0 1rem;
}
.bridge-visual {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0;
  margin: 1rem 0;
  min-height: 4rem;
}
.bridge-left,
.bridge-right {
  flex: 1;
  height: 2rem;
  background: linear-gradient(to top, #8b4513 0%, #a0522d 100%);
  border-radius: 0 0 0.25rem 0.25rem;
}
.bridge-gap {
  width: 4rem;
  min-height: 3rem;
  margin: 0 0.25rem;
  border: 2px dashed #999;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  cursor: pointer;
}
.bridge-gap:hover,
.bridge-gap:focus {
  background: #eee;
  border-color: #06c;
}
.bridge-gap:focus-visible {
  outline: 2px solid #06c;
  outline-offset: 2px;
}
.bridge-gap.has-selection {
  border-color: #06c;
  background: #e6f2ff;
}
.slot-preview,
.slot-hint {
  font-size: 1.25rem;
  font-weight: bold;
  color: #666;
}
.planks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
}
.plank {
  padding: 0.75rem 1.25rem;
  min-width: 3rem;
  font-size: 1.125rem;
  font-weight: bold;
  border: 2px solid #8b4513;
  border-radius: 0.25rem;
  background: linear-gradient(to bottom, #deb887 0%, #d2691e 100%);
  cursor: grab;
}
.plank:active {
  cursor: grabbing;
}
.plank:hover:not(:disabled) {
  background: linear-gradient(to bottom, #e8d4b8 0%, #da8a4a 100%);
}
.plank:focus-visible {
  outline: 2px solid #06c;
  outline-offset: 2px;
}
.plank.selected {
  border-color: #06c;
  background: #e6f2ff;
  box-shadow: 0 0 0 2px #06c;
}
.plank:disabled {
  cursor: default;
  opacity: 0.8;
}
.feedback {
  margin-top: 1rem;
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
  color: #080;
}
.feedback .hint,
.feedback .info {
  color: #666;
}
.next {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
.next:focus-visible {
  outline: 2px solid #06c;
  outline-offset: 2px;
}
.stats {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}
</style>
