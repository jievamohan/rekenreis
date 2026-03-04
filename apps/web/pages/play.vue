<script setup lang="ts">
import type { GameMode } from '~/types/game'
import type { Level } from '~/types/level'
import { usePlayGame } from '~/composables/usePlayGame'
import levelsV1 from '~/content/levels.v1.json'

const route = useRoute()
const playSource = computed(() =>
  route.query.mode === 'pack' ? 'pack' : 'infinite'
)
const levelPack = computed(() =>
  playSource.value === 'pack' ? (levelsV1 as Level[]) : []
)

const mode = ref<GameMode>('upTo10')
const game = usePlayGame(mode, {
  source: playSource.value,
  levelPack: levelPack.value,
})

function handleAnswer(choice: number) {
  game.selectAnswer(choice)
}

function handleNext() {
  game.nextQuestion()
}
</script>

<template>
  <div class="play" role="main">
    <h1>Math Game</h1>

    <div v-if="game.question.value" class="question" role="group" :aria-label="`${game.question.value.a} plus ${game.question.value.b} equals ?`">
      <p class="prompt">{{ game.question.value.a }} + {{ game.question.value.b }} = ?</p>

      <div class="choices" role="group" aria-label="Answer choices">
        <button
          v-for="(choice, i) in game.question.value.choices"
          :key="`${choice}-${i}`"
          type="button"
          class="choice"
          :class="{ disabled: !!game.feedback.value }"
          :disabled="!!game.feedback.value"
          :tabindex="game.feedback.value ? -1 : 0"
          @click="handleAnswer(choice)"
          @keydown.enter.prevent="handleAnswer(choice)"
          @keydown.space.prevent="handleAnswer(choice)"
        >
          {{ choice }}
        </button>
      </div>
    </div>

    <div v-if="game.feedback.value" class="feedback" role="status" aria-live="polite">
      <p v-if="game.feedback.value.correct" class="correct">Correct!</p>
      <p v-else class="incorrect">
        Not quite. The answer was {{ game.question.value?.correctAnswer }}.
      </p>
      <button type="button" class="next" @click="handleNext" @keydown.enter.prevent="handleNext" @keydown.space.prevent="handleNext">
        Next
      </button>
    </div>

    <div class="stats" role="status">
      <span>Score: {{ game.score.value }}</span>
      <span>Streak: {{ game.streak.value }}</span>
    </div>

    <div class="mode">
      <label>
        <input v-model="mode" type="radio" value="upTo10" />
        Up to 10
      </label>
      <label>
        <input v-model="mode" type="radio" value="upTo20" />
        Up to 20
      </label>
    </div>
  </div>
</template>

<style scoped>
.play {
  max-width: 24rem;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, sans-serif;
}

h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.question {
  margin: 1.5rem 0;
}

.prompt {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.choice {
  min-width: 3.5rem;
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  border: 2px solid #333;
  border-radius: 0.5rem;
  background: #fff;
  cursor: pointer;
}

.choice:hover:not(.disabled) {
  background: #f0f0f0;
}

.choice:focus-visible {
  outline: 2px solid #06c;
  outline-offset: 2px;
}

.choice.disabled {
  cursor: default;
  opacity: 0.7;
}

.feedback {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
}

.feedback .correct {
  color: #0a0;
  font-weight: 600;
}

.feedback .incorrect {
  color: #c00;
}

.next {
  display: block;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #333;
  border-radius: 0.375rem;
  background: #fff;
  cursor: pointer;
}

.next:focus-visible {
  outline: 2px solid #06c;
  outline-offset: 2px;
}

.stats {
  margin-top: 1rem;
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;
}

.mode {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.mode label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
}
</style>
