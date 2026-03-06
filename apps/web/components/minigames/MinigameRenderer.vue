<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import type { MinigameId } from '~/types/minigame'
import { useMinigame } from '~/composables/useMinigame'

const props = defineProps<{
  minigameId: MinigameId
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const { getDefinition } = useMinigame()

const FallbackKeypad = defineAsyncComponent(
  () => import('~/components/play/Keypad.vue')
)

const activeComponent = computed(() => {
  const def = getDefinition(props.minigameId)
  if (!def) return FallbackKeypad
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
    <Suspense>
      <component
        :is="activeComponent"
        :question="props.question"
        :difficulty-params="props.difficultyParams"
        @answer="handleAnswer"
      />
      <template #fallback>
        <div class="minigame-loading" aria-live="polite">
          Laden...
        </div>
      </template>
    </Suspense>
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
