import { describe, it, expect } from 'vitest'
import { resolveSkinId, SKIN_IDS } from '../utils/skinResolver'

describe('resolveSkinId (useSkin id resolution)', () => {
  it('returns classic for valid id "classic"', () => {
    expect(resolveSkinId('classic')).toBe('classic')
  })

  it('returns monster-feed for valid id "monster-feed"', () => {
    expect(resolveSkinId('monster-feed')).toBe('monster-feed')
  })

  it('normalizes monster_feed to monster-feed', () => {
    expect(resolveSkinId('monster_feed')).toBe('monster-feed')
  })

  it('returns classic for unknown id (fallback)', () => {
    expect(resolveSkinId('unknown-skin')).toBe('classic')
  })

  it('returns classic for undefined (fallback)', () => {
    expect(resolveSkinId(undefined)).toBe('classic')
  })

  it('returns classic for empty string (fallback)', () => {
    expect(resolveSkinId('')).toBe('classic')
  })

  it('SKIN_IDS includes all valid ids', () => {
    expect(SKIN_IDS).toContain('classic')
    expect(SKIN_IDS).toContain('monster-feed')
  })
})
