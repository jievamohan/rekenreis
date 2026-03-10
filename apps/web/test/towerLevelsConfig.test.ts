import { describe, it, expect } from 'vitest'
import type { TowerLevelConfig } from '~/types/tower'
import levelsBouwDeToren from '../content/levels.bouw-de-toren.v1.json'

function isValidTowerLevelConfig(c: unknown): c is TowerLevelConfig {
  if (!c || typeof c !== 'object') return false
  const o = c as Record<string, unknown>
  return (
    typeof o.rounds === 'number' &&
    o.rounds > 0 &&
    Array.isArray(o.targetRange) &&
    o.targetRange.length === 2 &&
    typeof o.blockPoolSize === 'number' &&
    o.blockPoolSize > 0 &&
    (!o.starThresholds ||
      (Array.isArray(o.starThresholds) &&
        o.starThresholds.length === 3 &&
        (o.starThresholds as number[]).every((t) => typeof t === 'number')))
  )
}

describe('levels.bouw-de-toren.v1.json', () => {
  it('has level configs with starThresholds', () => {
    expect(Array.isArray(levelsBouwDeToren)).toBe(true)
    expect(levelsBouwDeToren.length).toBeGreaterThan(0)
    for (let i = 0; i < levelsBouwDeToren.length; i++) {
      expect(isValidTowerLevelConfig(levelsBouwDeToren[i])).toBe(true)
      const config = levelsBouwDeToren[i] as TowerLevelConfig
      expect(config.starThresholds).toBeDefined()
      expect(config.starThresholds!.length).toBe(3)
    }
  })
})
