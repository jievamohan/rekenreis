import { describe, it, expect } from 'vitest'
import { getUnlockedSkinIds } from '../composables/useRewards'

describe('getUnlockedSkinIds', () => {
  it('unlocks classic and monster-feed at score 0', () => {
    expect(getUnlockedSkinIds(0)).toContain('classic')
    expect(getUnlockedSkinIds(0)).toContain('monster-feed')
    expect(getUnlockedSkinIds(0)).not.toContain('space')
    expect(getUnlockedSkinIds(0)).not.toContain('pirate')
  })

  it('unlocks space at score 5', () => {
    const ids = getUnlockedSkinIds(5)
    expect(ids).toContain('classic')
    expect(ids).toContain('monster-feed')
    expect(ids).toContain('space')
    expect(ids).not.toContain('pirate')
  })

  it('unlocks pirate at score 10', () => {
    const ids = getUnlockedSkinIds(10)
    expect(ids).toContain('classic')
    expect(ids).toContain('monster-feed')
    expect(ids).toContain('space')
    expect(ids).toContain('pirate')
  })

  it('unlocks all skins at score 100', () => {
    const ids = getUnlockedSkinIds(100)
    expect(ids).toHaveLength(4)
    expect(ids).toEqual(expect.arrayContaining(['classic', 'monster-feed', 'space', 'pirate']))
  })

  it('handles negative score as 0', () => {
    const ids = getUnlockedSkinIds(-5)
    expect(ids).toEqual(getUnlockedSkinIds(0))
  })

  it('handles fractional score (floors)', () => {
    const ids = getUnlockedSkinIds(4.9)
    expect(ids).not.toContain('space')
    const ids5 = getUnlockedSkinIds(5.1)
    expect(ids5).toContain('space')
  })
})
