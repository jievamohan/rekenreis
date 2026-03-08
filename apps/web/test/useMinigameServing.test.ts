import { describe, test, expect } from 'vitest'
import { useMinigameServing } from '~/composables/useMinigameServing'
import type { MinigameMapEntry } from '~/types/minigame'

const weightedPool: MinigameMapEntry = {
  type: 'weighted',
  pool: [
    { minigameId: 'bubble-pop', weight: 1 },
    { minigameId: 'treasure-dive', weight: 1 },
    { minigameId: 'fish-feed', weight: 1 },
    { minigameId: 'memory-match', weight: 1 },
  ],
}

const directEntry: MinigameMapEntry = {
  type: 'direct',
  minigameId: 'bubble-pop',
}

describe('useMinigameServing', () => {
  test('deterministic: same seed produces same result', () => {
    const s1 = useMinigameServing()
    const s2 = useMinigameServing()
    const r1 = s1.pick(weightedPool, 42)
    const r2 = s2.pick(weightedPool, 42)
    expect(r1).toBe(r2)
  })

  test('different seeds produce different sequences over multiple picks', () => {
    const s1 = useMinigameServing()
    const s2 = useMinigameServing()
    const results1: string[] = []
    const results2: string[] = []
    for (let i = 0; i < 10; i++) {
      results1.push(s1.pick(weightedPool, 100 + i))
      results2.push(s2.pick(weightedPool, 200 + i))
    }
    expect(results1).not.toEqual(results2)
  })

  test('direct entry always returns the specified minigame', () => {
    const serving = useMinigameServing()
    for (let i = 0; i < 5; i++) {
      expect(serving.pick(directEntry, i)).toBe('bubble-pop')
    }
  })

  test('no-repeat window prevents consecutive same picks', () => {
    const serving = useMinigameServing({ noRepeatWindow: 2 })
    const results: string[] = []
    for (let i = 0; i < 20; i++) {
      results.push(serving.pick(weightedPool, i * 7 + 1))
    }
    for (let i = 2; i < results.length; i++) {
      const windowCheck = results[i] === results[i - 1] && results[i] === results[i - 2]
      expect(windowCheck, `Triple repeat at index ${i}: ${results.slice(i - 2, i + 1)}`).toBe(false)
    }
  })

  test('serves all minigames from a pool over many picks', () => {
    const serving = useMinigameServing({ noRepeatWindow: 1 })
    const seen = new Set<string>()
    for (let i = 0; i < 100; i++) {
      seen.add(serving.pick(weightedPool, i * 13 + 7))
    }
    expect(seen.size).toBe(4)
  })

  test('reset clears history', () => {
    const serving = useMinigameServing()
    serving.pick(weightedPool, 1)
    serving.pick(weightedPool, 2)
    expect(serving.getHistory().length).toBeGreaterThan(0)
    serving.reset()
    expect(serving.getHistory().length).toBe(0)
  })

  test('pickWithRng uses provided rng', () => {
    const serving = useMinigameServing()
    let callCount = 0
    const mockRng = () => {
      callCount++
      return 0.1
    }
    serving.pickWithRng(weightedPool, mockRng)
    expect(callCount).toBeGreaterThan(0)
  })

  test('handles pool with single entry gracefully', () => {
    const singlePool: MinigameMapEntry = {
      type: 'weighted',
      pool: [{ minigameId: 'fish-feed', weight: 1 }],
    }
    const serving = useMinigameServing({ noRepeatWindow: 2 })
    const result = serving.pick(singlePool, 42)
    expect(result).toBe('fish-feed')
  })
})
