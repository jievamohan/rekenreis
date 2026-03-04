import type { Ref } from 'vue'
import {
  type ProgressSchemaV1,
  loadProgress,
  saveProgress,
} from '../utils/persistenceSchema'

type ProfileApi = {
  activeProfile: { value: { id: string; progress: { bestScore: number } } | null }
  updateProfile: (id: string, u: Record<string, unknown>) => void
}

export function usePersistence(currentScore: Ref<number>, profile?: ProfileApi) {
  const progress = ref<ProgressSchemaV1>(loadProgress())

  const bestScore = computed(() => {
    if (profile?.activeProfile.value) {
      return profile.activeProfile.value.progress.bestScore
    }
    return progress.value.bestScore
  })

  watch(
    currentScore,
    (s) => {
      const v = Math.max(0, Math.floor(s))
      const current = bestScore.value
      if (v <= current) return
      if (profile?.activeProfile.value) {
        profile.updateProfile(profile.activeProfile.value.id, {
          progress: { ...profile.activeProfile.value.progress, bestScore: v },
        })
      } else {
        const next: ProgressSchemaV1 = { version: 1, bestScore: v }
        progress.value = next
        saveProgress(next)
      }
    },
    { immediate: true }
  )

  return {
    bestScore: readonly(bestScore),
  }
}
