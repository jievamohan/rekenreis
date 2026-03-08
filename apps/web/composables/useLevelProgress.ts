import { computed, type ComputedRef } from 'vue'
import type { LevelStars, ProfileData } from '~/utils/profileSchema'

interface ProfileApi {
  activeProfile: ComputedRef<ProfileData | null>
  updateProfile: (id: string, updates: Partial<Pick<ProfileData, 'progress'>>) => void
}

export function useLevelProgress(profile: ProfileApi) {
  const levelProgress = computed<Record<number, LevelStars>>(() => {
    return profile.activeProfile.value?.progress.levelProgress ?? {}
  })

  const currentLevel = computed<number>(() => {
    return profile.activeProfile.value?.progress.currentLevel ?? 1
  })

  function completeLevel(level: number, stars: number) {
    const p = profile.activeProfile.value
    if (!p) return

    const clamped = Math.max(0, Math.min(3, Math.floor(stars)))
    const existing = p.progress.levelProgress ?? {}
    const prev = existing[level]?.stars ?? 0
    const best = Math.max(prev, clamped)

    const nextProgress = {
      ...p.progress,
      levelProgress: { ...existing, [level]: { stars: best } },
      currentLevel: Math.max(p.progress.currentLevel ?? 1, level + 1),
    }

    profile.updateProfile(p.id, { progress: nextProgress })
  }

  function isUnlocked(level: number): boolean {
    return level <= currentLevel.value
  }

  function starsFor(level: number): number {
    return levelProgress.value[level]?.stars ?? 0
  }

  return {
    levelProgress: computed(() => levelProgress.value),
    currentLevel: computed(() => currentLevel.value),
    completeLevel,
    isUnlocked,
    starsFor,
  }
}
