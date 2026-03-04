import type { Ref } from 'vue'
import type { SkinId } from '../utils/skinResolver'
import { SKIN_IDS } from '../utils/skinResolver'
import { UNLOCK_THRESHOLDS } from '../utils/rewardsConfig'
import { usePersistence } from './usePersistence'

/**
 * Returns skin ids unlocked at or below the given score.
 */
export function getUnlockedSkinIds(score: number): SkinId[] {
  const s = Math.max(0, Math.floor(score))
  return SKIN_IDS.filter((id) => UNLOCK_THRESHOLDS[id] <= s)
}

/**
 * Rewards composable: unlock skins by score threshold.
 * Uses usePersistence for versioned best score storage.
 */
export function useRewards(currentScore: Ref<number>) {
  const { bestScore } = usePersistence(currentScore)

  const unlockedIds = computed(() => getUnlockedSkinIds(bestScore.value))

  function isUnlocked(skinId: SkinId): boolean {
    return unlockedIds.value.includes(skinId)
  }

  return {
    bestScore: readonly(bestScore),
    unlockedIds,
    isUnlocked,
  }
}
