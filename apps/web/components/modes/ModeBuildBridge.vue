<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SkinRoundProps } from '~/types/skin'
import type { SkinId } from '~/utils/skinResolver'
import { isCorrectFeedback, isTimeoutFeedback } from '~/utils/feedbackHelpers'
import SceneLayout from '~/components/graphics/SceneLayout.vue'
import HintDots from '~/components/hints/HintDots.vue'
import HintNumberLine from '~/components/hints/HintNumberLine.vue'
import charPlaceholder from '~/assets/graphics/characters/placeholder.svg'
import bridgeLeft from '~/assets/graphics/objects/bridge-left.svg'
import bridgeRight from '~/assets/graphics/objects/bridge-right.svg'

const props = defineProps<
  SkinRoundProps & { effectiveSkinId: SkinId; recordTimeout?: () => void }
>()

const isWrongFeedback = computed(() =>
  props.feedback &&
  'correct' in props.feedback &&
  !props.feedback.correct
)

const selectedPlank = ref<number | null>(null)

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
    <SceneLayout v-if="question">
      <template #foreground>
        <div class="bridge-visual" role="group" :aria-label="`${question.a} plus ${question.b} equals ?`">
          <img :src="bridgeLeft" alt="" class="bridge-left" aria-hidden="true">
          <div
            class="bridge-gap"
            :class="{ wobble: isWrongFeedback, 'has-selection': selectedPlank !== null }"
            role="button"
            tabindex="0"
            :aria-label="selectedPlank !== null ? `Place plank ${selectedPlank} here` : 'Drop zone for answer plank'"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @click="handlePlace"
            @keydown.enter.prevent="handlePlace"
            @keydown.space.prevent="handlePlace"
          >
            <span v-if="selectedPlank !== null" class="slot-preview">{{ selectedPlank }}</span>
            <span v-else class="slot-hint">?</span>
          </div>
          <img :src="bridgeRight" alt="" class="bridge-right" aria-hidden="true">
        </div>
      </template>
      <template #character>
        <img :src="charPlaceholder" alt="" class="char-img" aria-hidden="true">
      </template>

      <div class="scene-body">
        <p class="prompt">{{ question.a }} + {{ question.b }} = ?</p>

        <div v-if="hintToShow === 'dots' && hintQuestion" class="hint-area">
          <HintDots
            :a="hintQuestion.a"
            :b="hintQuestion.b"
            :correct-answer="hintQuestion.correctAnswer"
          />
        </div>
        <div v-else-if="hintToShow === 'number-line' && hintQuestion" class="hint-area">
          <HintNumberLine
            :a="hintQuestion.a"
            :b="hintQuestion.b"
            :correct-answer="hintQuestion.correctAnswer"
          />
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
            <span class="plank-number">{{ choice }}</span>
          </button>
        </div>
      </div>
    </SceneLayout>

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
  max-width: 28rem;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

.scene-body {
  padding: 0.5rem 0;
}

.prompt {
  font-size: 1.125rem;
  margin: 0 0 1rem;
  color: var(--graphics-text);
  font-weight: 600;
}

.bridge-visual {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0;
  padding: 0 1rem;
  min-height: 5rem;
}

.bridge-left,
.bridge-right {
  flex: 1;
  max-width: 100px;
  height: 24px;
  object-fit: fill;
}

.bridge-gap {
  width: 64px;
  min-height: 48px;
  margin: 0 0.25rem;
  border: 2px dashed var(--graphics-text-muted);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 245, 245, 0.9);
  cursor: pointer;
}

.bridge-gap:hover,
.bridge-gap:focus {
  background: rgba(238, 238, 238, 0.95);
  border-color: var(--graphics-accent);
}

.bridge-gap:focus-visible {
  outline: 2px solid var(--graphics-accent);
  outline-offset: 2px;
}

.bridge-gap.has-selection {
  border-color: var(--graphics-accent);
  background: rgba(46, 125, 50, 0.15);
}

.bridge-gap.wobble {
  animation: gap-wobble 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .bridge-gap.wobble {
    animation: none;
  }
}

@keyframes gap-wobble {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.hint-area {
  margin: 0.75rem 0;
}

.slot-preview,
.slot-hint {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--graphics-text-muted);
}

.char-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.planks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  justify-content: center;
}

.plank {
  min-width: 56px;
  min-height: 48px;
  padding: 0.5rem 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  border: 2px solid var(--graphics-bridge);
  border-radius: 0.375rem;
  background: linear-gradient(to bottom, var(--graphics-plank-highlight) 0%, var(--graphics-plank) 100%);
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.plank-number {
  color: var(--graphics-text);
}

.plank:active {
  cursor: grabbing;
}

.plank:hover:not(:disabled) {
  background: linear-gradient(to bottom, #e8d4b8 0%, #da8a4a 100%);
  transform: translateY(-1px);
}

.plank:focus-visible {
  outline: 2px solid var(--graphics-accent);
  outline-offset: 2px;
}

.plank.selected {
  border-color: var(--graphics-accent);
  background: rgba(46, 125, 50, 0.2);
  box-shadow: 0 0 0 2px var(--graphics-accent);
}

.plank:disabled {
  cursor: default;
  opacity: 0.85;
}

.feedback {
  margin-top: 1rem;
}

.feedback-correct {
  animation: feedback-bounce 0.4s ease-out;
}

.feedback-incorrect {
  animation: feedback-shake 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .feedback-correct,
  .feedback-incorrect {
    animation: none;
  }
}

@keyframes feedback-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes feedback-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.feedback .correct {
  color: var(--graphics-accent);
}

.feedback .hint,
.feedback .info {
  color: var(--graphics-text-muted);
}

.next {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  min-height: 44px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 0.375rem;
}

.next:focus-visible {
  outline: 2px solid var(--graphics-accent);
  outline-offset: 2px;
}

.stats {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--graphics-text-muted);
}
</style>
