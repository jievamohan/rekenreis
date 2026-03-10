import { describe, it, expect } from 'vitest'
import { useTowerLevelEngine } from '../composables/useTowerLevelEngine'
import type { TowerLevelConfig } from '~/types/tower'

function createConfig(overrides?: Partial<TowerLevelConfig>): TowerLevelConfig {
  return {
    rounds: 5,
    targetRange: [3, 10],
    blockPoolSize: 6,
    starThresholds: [2, 3, 4],
    ...overrides,
  }
}

describe('useTowerLevelEngine', () => {
  it('starts at round 0', () => {
    const engine = useTowerLevelEngine(createConfig(), 42)
    expect(engine.currentRoundIndex.value).toBe(0)
    expect(engine.phase.value).toBe('playing')
  })

  it('recordWrong skips round immediately (one chance per tower)', () => {
    const engine = useTowerLevelEngine(createConfig(), 42)
    engine.recordWrong()
    expect(engine.correctRounds.value).toBe(0)
    expect(engine.phase.value).toBe('roundComplete')
    engine.goToNextRound()
    expect(engine.currentRoundIndex.value).toBe(1)
    expect(engine.phase.value).toBe('playing')
  })

  it('recordCorrect completes round', () => {
    const engine = useTowerLevelEngine(createConfig(), 42)
    engine.recordCorrect()
    expect(engine.correctRounds.value).toBe(1)
    expect(engine.phase.value).toBe('roundComplete')
    engine.goToNextRound()
    expect(engine.currentRoundIndex.value).toBe(1)
    expect(engine.phase.value).toBe('playing')
  })

  it('stars computed from correctRounds', () => {
    const engine = useTowerLevelEngine(createConfig({ starThresholds: [2, 3, 4] }), 42)
    expect(engine.stars.value).toBe(0)
    engine.recordCorrect()
    engine.goToNextRound()
    engine.recordCorrect()
    engine.goToNextRound()
    expect(engine.correctRounds.value).toBe(2)
    expect(engine.stars.value).toBe(1)
  })

  it('levelComplete when all rounds done', () => {
    const engine = useTowerLevelEngine(createConfig({ rounds: 2 }), 42)
    engine.recordCorrect()
    engine.goToNextRound()
    engine.recordCorrect()
    engine.goToNextRound()
    expect(engine.phase.value).toBe('levelComplete')
  })

  it('currentPuzzle returns puzzle for current round', () => {
    const engine = useTowerLevelEngine(createConfig(), 42)
    const puzzle = engine.currentPuzzle.value
    expect(puzzle).not.toBeNull()
    expect(puzzle!.target).toBeGreaterThanOrEqual(3)
    expect(puzzle!.target).toBeLessThanOrEqual(10)
    expect(puzzle!.blocks).toHaveLength(6)
  })
})
