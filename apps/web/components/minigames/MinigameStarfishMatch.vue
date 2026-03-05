<script setup lang="ts">
import type { AdditionQuestion } from '~/types/game'

defineProps<{
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

function selectChoice(choice: number) {
  emit('answer', choice)
}
</script>

<template>
  <div class="minigame-placeholder" data-testid="minigame-starfish-match" role="group" aria-label="Starfish Match">
    <div class="placeholder-choices">
      <button
        v-for="choice in question.choices"
        :key="choice"
        class="placeholder-btn"
        @click="selectChoice(choice)"
      >
        {{ choice }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.minigame-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}
.placeholder-choices {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}
.placeholder-btn {
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  border: 2px solid #ffd54f;
  background: #fffde7;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.placeholder-btn:hover,
.placeholder-btn:focus-visible {
  transform: scale(1.1);
}
</style>
