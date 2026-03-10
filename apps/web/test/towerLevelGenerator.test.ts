import { describe, it, expect } from 'vitest'
import {
  generateTowerPuzzle,
  generateTowerLevel,
  hasValidSolution,
} from '../utils/towerLevelGenerator'
import type { TowerLevelConfig } from '~/types/tower'

describe('towerLevelGenerator', () => {
  describe('generateTowerPuzzle', () => {
    it('same seed produces same puzzle', () => {
      const p1 = generateTowerPuzzle(42, [5, 10], 6)
      const p2 = generateTowerPuzzle(42, [5, 10], 6)
      expect(p1.target).toBe(p2.target)
      expect(p1.blocks).toEqual(p2.blocks)
    })

    it('different seeds produce different puzzles', () => {
      const p1 = generateTowerPuzzle(1, [5, 10], 6)
      const p2 = generateTowerPuzzle(2, [5, 10], 6)
      expect(p1.target !== p2.target || p1.blocks.join() !== p2.blocks.join()).toBe(true)
    })

    it('target is within range', () => {
      for (let s = 100; s < 150; s++) {
        const p = generateTowerPuzzle(s, [5, 12], 6)
        expect(p.target).toBeGreaterThanOrEqual(5)
        expect(p.target).toBeLessThanOrEqual(12)
      }
    })

    it('blocks count matches blockPoolSize', () => {
      const p = generateTowerPuzzle(99, [3, 8], 5)
      expect(p.blocks).toHaveLength(5)
    })

    it('every puzzle has at least one valid solution', () => {
      for (let s = 200; s < 250; s++) {
        const p = generateTowerPuzzle(s, [2, 15], 6)
        expect(hasValidSolution(p)).toBe(true)
      }
    })
  })

  describe('generateTowerLevel', () => {
    const config: TowerLevelConfig = {
      rounds: 5,
      targetRange: [3, 10],
      blockPoolSize: 6,
    }

    it('same seed produces same level', () => {
      const l1 = generateTowerLevel(123, config)
      const l2 = generateTowerLevel(123, config)
      expect(l1).toEqual(l2)
    })

    it('produces correct number of rounds', () => {
      const level = generateTowerLevel(456, config)
      expect(level).toHaveLength(5)
    })

    it('each round has one tower', () => {
      const level = generateTowerLevel(789, config)
      for (const round of level) {
        expect(round).toHaveLength(1)
      }
    })

    it('every tower has at least one valid solution', () => {
      const level = generateTowerLevel(999, config)
      for (const round of level) {
        for (const tower of round) {
          expect(hasValidSolution(tower)).toBe(true)
        }
      }
    })
  })

  describe('hasValidSolution', () => {
    it('returns true when valid pair exists', () => {
      expect(hasValidSolution({ target: 10, blocks: [3, 7, 1, 2] })).toBe(true)
      expect(hasValidSolution({ target: 5, blocks: [2, 3, 0, 1] })).toBe(true)
    })

    it('returns false when no valid pair', () => {
      expect(hasValidSolution({ target: 10, blocks: [1, 2, 3, 4] })).toBe(false)
    })
  })
})
