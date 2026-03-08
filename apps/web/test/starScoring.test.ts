import { describe, it, expect } from 'vitest'
import { computeStars } from '../utils/starScoring'

describe('computeStars', () => {
  it('returns 0 when below first threshold (10 rounds, default)', () => {
    expect(computeStars(0, 10)).toBe(0)
    expect(computeStars(1, 10)).toBe(0)
    expect(computeStars(2, 10)).toBe(0)
  })

  it('returns 1 when at or above first threshold, below second (10 rounds)', () => {
    expect(computeStars(3, 10)).toBe(1)
    expect(computeStars(4, 10)).toBe(1)
    expect(computeStars(5, 10)).toBe(1)
  })

  it('returns 2 when at or above second threshold, below third (10 rounds)', () => {
    expect(computeStars(6, 10)).toBe(2)
    expect(computeStars(7, 10)).toBe(2)
    expect(computeStars(8, 10)).toBe(2)
  })

  it('returns 3 when at or above third threshold (10 rounds)', () => {
    expect(computeStars(9, 10)).toBe(3)
    expect(computeStars(10, 10)).toBe(3)
  })

  it('uses custom thresholds when provided', () => {
    expect(computeStars(2, 10, [2, 5, 8])).toBe(1)
    expect(computeStars(4, 10, [2, 5, 8])).toBe(1)
    expect(computeStars(5, 10, [2, 5, 8])).toBe(2)
    expect(computeStars(8, 10, [2, 5, 8])).toBe(3)
  })

  it('uses 5-round defaults for totalRounds <= 5', () => {
    expect(computeStars(0, 5)).toBe(0)
    expect(computeStars(1, 5)).toBe(0)
    expect(computeStars(2, 5)).toBe(1)
    expect(computeStars(3, 5)).toBe(2)
    expect(computeStars(4, 5)).toBe(3)
    expect(computeStars(5, 5)).toBe(3)
  })
})
