import type { Ref } from 'vue'
import type { SkinId } from '../utils/skinResolver'
import { SKIN_IDS } from '../utils/skinResolver'
import { UNLOCK_THRESHOLDS } from '../utils/rewardsConfig'

const STORAGE_KEY = 'rekenreis_best_score'

function getStoredBestScore(): number {
  if (typeof window === 'undefined') return 0
  const raw = localStorage.getItem(STORAGE_KEY)
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function setStoredBestScore(score: number): void {
  if (typeof window === 'undefined' || score < 0) return
  localStorage.setItem(STORAGE_KEY, String(Math.floor(score)))
}

/**
 * Returns skin ids unlocked at or below the given score.
 */
export function getUnlockedSkinIds(score: number): SkinId[] {
  const s = Math.max(0, Math.floor(score))
  return SKIN_IDS.filter((id) => UNLOCK_THRESHOLDS[id] <= s)
}

/**
 * Rewards composable: unlock skins by score threshold.
 * Persists best score in localStorage. Pass current score to update.
 */
export function useRewards(currentScore: Ref<number>) {
  const bestScore = ref(getStoredBestScore())

  watch(
    currentScore,
    (s) => {
      const v = Math.max(0, Math.floor(s))
      if (v > bestScore.value) {
        bestScore.value = v
        setStoredBestScore(v)
      }
    },
    { immediate: true }
  )

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
