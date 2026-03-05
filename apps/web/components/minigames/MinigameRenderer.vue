<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import type { MinigameId } from '~/types/minigame'

const props = defineProps<{
  minigameId: MinigameId
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const componentMap: Record<MinigameId, () => Promise<Component>> = {
  'bubble-pop': () => import('~/components/minigames/MinigameBubblePop.vue'),
  'treasure-dive': () => import('~/components/minigames/MinigameTreasureDive.vue'),
  'fish-feed': () => import('~/components/minigames/MinigameFishFeed.vue'),
  'coral-builder': () => import('~/components/minigames/MinigameCoralBuilder.vue'),
  'submarine-sort': () => import('~/components/minigames/MinigameSubmarineSort.vue'),
  'starfish-match': () => import('~/components/minigames/MinigameStarfishMatch.vue'),
}

const FallbackKeypad = defineAsyncComponent(
  () => import('~/components/play/Keypad.vue')
)

const activeComponent = computed(() => {
  const loader = componentMap[props.minigameId]
  if (!loader) return FallbackKeypad
  return defineAsyncComponent({
    loader,
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
