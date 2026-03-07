<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import type { MinigameId } from '~/types/minigame'
import { useMinigame } from '~/composables/useMinigame'

const props = defineProps<{
  minigameId: MinigameId
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
  timersDisabled?: boolean
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const { getDefinition } = useMinigame()

const activeComponent = computed(() => {
  const def = getDefinition(props.minigameId)
  if (!def) return null
  return defineAsyncComponent({
    loader: def.component,
    loadingComponent: undefined,
    errorComponent: undefined,
    timeout: 5000,
  })
})

function handleAnswer(choice: number) {
  emit('answer', choice)
}
</script>

<template>
  <div class="minigame-renderer" role="group" aria-label="Minigame">
    <template v-if="activeComponent">
      <Suspense>
        <component
          :is="activeComponent"
          :key="`${props.minigameId}-${props.question.a}-${props.question.b}`"
          :question="props.question"
          :difficulty-params="props.difficultyParams"
          :timers-disabled="props.timersDisabled"
          @answer="handleAnswer"
        />
        <template #fallback>
          <div class="minigame-loading" aria-live="polite">
            Laden...
          </div>
        </template>
      </Suspense>
    </template>
    <div v-else class="minigame-loading" role="alert">
      Minigame niet beschikbaar.
    </div>
  </div>
</template>

<style scoped>
.minigame-renderer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.minigame-loading {
  padding: 2rem;
  text-align: center;
  font-size: 1.25rem;
  color: var(--app-text-secondary, #666);
}
</style>
