import type { Ref } from 'vue'
import {
  type ProgressSchemaV1,
  loadProgress,
  saveProgress,
} from '../utils/persistenceSchema'

export function usePersistence(currentScore: Ref<number>) {
  const progress = ref<ProgressSchemaV1>(loadProgress())

  watch(
    currentScore,
    (s) => {
      const v = Math.max(0, Math.floor(s))
      if (v > progress.value.bestScore) {
        const next: ProgressSchemaV1 = { version: 1, bestScore: v }
        progress.value = next
        saveProgress(next)
      }
    },
    { immediate: true }
  )

  const bestScore = computed(() => progress.value.bestScore)

  return {
    bestScore: readonly(bestScore),
  }
}
