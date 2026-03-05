import type { MinigameId, MinigameMapEntry } from '~/types/minigame'
import { createSeededRng } from '~/utils/seedableRng'

interface ServingOptions {
  noRepeatWindow?: number
}

export function useMinigameServing(options: ServingOptions = {}) {
  const noRepeatWindow = options.noRepeatWindow ?? 2
  const recentHistory: MinigameId[] = []

  function pickFromEntry(entry: MinigameMapEntry, rng: () => number): MinigameId {
    if (entry.type === 'direct') {
      return entry.minigameId
    }

    const pool = entry.pool
    if (pool.length === 0) {
      throw new Error('Empty minigame pool')
    }

    const candidates = pool.filter(
      (p) => !recentHistory.slice(-noRepeatWindow).includes(p.minigameId)
    )
    const effectivePool = candidates.length > 0 ? candidates : pool

    const totalWeight = effectivePool.reduce((sum, p) => sum + p.weight, 0)
    let roll = rng() * totalWeight
    for (const p of effectivePool) {
      roll -= p.weight
      if (roll <= 0) {
        recordPick(p.minigameId)
        return p.minigameId
      }
    }

    const last = effectivePool[effectivePool.length - 1]
    recordPick(last.minigameId)
    return last.minigameId
  }

  function recordPick(id: MinigameId): void {
    recentHistory.push(id)
    if (recentHistory.length > noRepeatWindow * 2) {
      recentHistory.splice(0, recentHistory.length - noRepeatWindow * 2)
    }
  }

  function pick(entry: MinigameMapEntry, seed: number): MinigameId {
    const rng = createSeededRng(seed)
    return pickFromEntry(entry, rng)
  }

  function pickWithRng(entry: MinigameMapEntry, rng: () => number): MinigameId {
    return pickFromEntry(entry, rng)
  }

  function reset(): void {
    recentHistory.length = 0
  }

  function getHistory(): readonly MinigameId[] {
    return [...recentHistory]
  }

  return { pick, pickWithRng, reset, getHistory }
}
