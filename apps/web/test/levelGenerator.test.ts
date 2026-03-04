import { describe, it, expect } from 'vitest'
import { generateLevelPack, generateQuestionFromLevel } from '../utils/levelGenerator'
import { createSeededRng } from '../utils/seedableRng'
import { validateLevel } from '../utils/levelValidator'

// Content pack should match generator output (run: node scripts/generate-levels.mjs)
import levelsV1 from '../content/levels.v1.json'

describe('levelGenerator', () => {
  describe('generateLevelPack', () => {
    it('same seed produces same level pack', () => {
      const pack1 = generateLevelPack(12345, { count: 10 })
      const pack2 = generateLevelPack(12345, { count: 10 })
      expect(pack1).toEqual(pack2)
    })

    it('different seeds produce different packs', () => {
      const pack1 = generateLevelPack(1, { count: 10 })
      const pack2 = generateLevelPack(2, { count: 10 })
      expect(pack1).not.toEqual(pack2)
    })

    it('respects config count', () => {
      const pack = generateLevelPack(42, { count: 25 })
      expect(pack).toHaveLength(25)
    })

    it('produces valid levels (pass validation)', () => {
      const pack = generateLevelPack(42, { count: 50 })
      for (const level of pack) {
        expect(() => validateLevel(level)).not.toThrow()
        const validated = validateLevel(level)
        expect(validated.operator).toBe('addition')
        expect(validated.operandMin).toBeLessThanOrEqual(validated.operandMax)
      }
    })
  })

  describe('generateQuestionFromLevel', () => {
    const level = {
      operator: 'addition' as const,
      operandMin: 0,
      operandMax: 10,
      choiceCount: 4,
      hintMode: 'none',
      difficultyTag: 'easy',
    }

    it('operands are within level range', () => {
      const rng = createSeededRng(999)
      for (let i = 0; i < 50; i++) {
        const q = generateQuestionFromLevel(level, rng)
        expect(q.a).toBeGreaterThanOrEqual(level.operandMin)
        expect(q.a).toBeLessThanOrEqual(level.operandMax)
        expect(q.b).toBeGreaterThanOrEqual(level.operandMin)
        expect(q.b).toBeLessThanOrEqual(level.operandMax)
      }
    })

    it('correct answer equals a + b', () => {
      const rng = createSeededRng(888)
      for (let i = 0; i < 50; i++) {
        const q = generateQuestionFromLevel(level, rng)
        expect(q.a + q.b).toBe(q.correctAnswer)
      }
    })

    it('choices include correct answer exactly once', () => {
      const rng = createSeededRng(777)
      for (let i = 0; i < 50; i++) {
        const q = generateQuestionFromLevel(level, rng)
        const count = q.choices.filter((c) => c === q.correctAnswer).length
        expect(count).toBe(1)
      }
    })

    it('choices are unique', () => {
      const rng = createSeededRng(666)
      for (let i = 0; i < 50; i++) {
        const q = generateQuestionFromLevel(level, rng)
        expect(new Set(q.choices).size).toBe(q.choices.length)
      }
    })

    it('choiceCount is respected', () => {
      const rng = createSeededRng(555)
      const level3 = { ...level, choiceCount: 3 }
      for (let i = 0; i < 20; i++) {
        const q = generateQuestionFromLevel(level3, rng)
        expect(q.choices).toHaveLength(3)
      }
    })
  })

  describe('content pack levels.v1.json', () => {
    it('exists with ~50 levels', () => {
      expect(Array.isArray(levelsV1)).toBe(true)
      expect(levelsV1.length).toBeGreaterThanOrEqual(45)
      expect(levelsV1.length).toBeLessThanOrEqual(55)
    })

    it('all levels pass validation', () => {
      for (const level of levelsV1 as unknown[]) {
        expect(() => validateLevel(level)).not.toThrow()
      }
    })

    it('matches generator output (seed 42, count 50)', () => {
      const expected = generateLevelPack(42, { count: 50 })
      expect(levelsV1).toHaveLength(expected.length)
      expect(JSON.stringify(levelsV1)).toBe(JSON.stringify(expected))
    })
  })
})
