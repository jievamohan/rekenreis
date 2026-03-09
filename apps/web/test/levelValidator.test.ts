import { describe, it, expect } from 'vitest'
import { validateLevel, parseLevel, LevelValidationError } from '../utils/levelValidator'

const validLevel = {
  operator: 'addition',
  operandMin: 0,
  operandMax: 10,
  choiceCount: 4,
  hintMode: 'none',
  difficultyTag: 'easy',
}

describe('levelValidator', () => {
  describe('validateLevel', () => {
    it('accepts valid level', () => {
      const result = validateLevel(validLevel)
      expect(result.operator).toBe('addition')
      expect(result).toMatchObject(validLevel)
      expect(result.operandMin).toBe(0)
      expect(result.operandMax).toBe(10)
      expect(result.choiceCount).toBe(4)
    })

    it('accepts valid level with optional masteryRules', () => {
      const withRules = { ...validLevel, masteryRules: { minCorrect: 3 } }
      const result = validateLevel(withRules)
      expect(result.masteryRules).toEqual({ minCorrect: 3 })
    })

    it('throws on invalid operator', () => {
      expect(() => validateLevel({ ...validLevel, operator: 'subtraction' })).toThrow()
    })

    it('throws on missing required field', () => {
      const rest = { ...validLevel }
      delete (rest as Record<string, unknown>).operator
      expect(() => validateLevel(rest)).toThrow()
    })

    it('throws on operandMin > operandMax', () => {
      expect(() =>
        validateLevel({ ...validLevel, operandMin: 15, operandMax: 10 })
      ).toThrow()
    })

    it('throws on invalid choiceCount (too low)', () => {
      expect(() => validateLevel({ ...validLevel, choiceCount: 1 })).toThrow()
    })

    it('throws on invalid choiceCount (too high)', () => {
      expect(() => validateLevel({ ...validLevel, choiceCount: 7 })).toThrow()
    })

    it('throws on non-integer operands', () => {
      expect(() => validateLevel({ ...validLevel, operandMin: 1.5 })).toThrow()
    })

    it('accepts valid modeIds', () => {
      const withModeIds = { ...validLevel, modeIds: ['classic', 'build-bridge'] }
      const result = validateLevel(withModeIds)
      expect(result.modeIds).toEqual(['classic', 'build-bridge'])
    })

    it('accepts valid pacingTag', () => {
      const withPacing = { ...validLevel, pacingTag: 'challenge' }
      const result = validateLevel(withPacing)
      expect(result.pacingTag).toBe('challenge')
    })

    it('throws on invalid modeIds (not array)', () => {
      expect(() => validateLevel({ ...validLevel, modeIds: 'classic' })).toThrow()
    })

    it('throws on invalid modeIds (bad value)', () => {
      expect(() => validateLevel({ ...validLevel, modeIds: ['invalid-mode'] })).toThrow()
    })

    it('throws on invalid pacingTag', () => {
      expect(() => validateLevel({ ...validLevel, pacingTag: 'hard' })).toThrow()
    })
  })

  describe('parseLevel', () => {
    it('returns success for valid level', () => {
      const result = parseLevel(validLevel)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validLevel)
      }
    })

    it('returns failure for invalid level', () => {
      const result = parseLevel({ ...validLevel, operator: 'mul' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(LevelValidationError)
      }
    })
  })

  describe('content packs with pacingTag', () => {
    const packs = [
      { name: 'classic', data: () => import('../content/levels.classic.v1.json').then((m) => m.default), min: 200, max: 200 },
      { name: 'timed-pop', data: () => import('../content/levels.timed-pop.v1.json').then((m) => m.default), min: 25, max: 30 },
      { name: 'build-bridge', data: () => import('../content/levels.build-bridge.v1.json').then((m) => m.default), min: 25, max: 30 },
    ]
    for (const pack of packs) {
      it(`${pack.name}: ${pack.min}-${pack.max} levels, all pass validation`, async () => {
        const levels = (await pack.data()) as unknown[]
        expect(Array.isArray(levels)).toBe(true)
        expect(levels.length).toBeGreaterThanOrEqual(pack.min)
        expect(levels.length).toBeLessThanOrEqual(pack.max)
        for (const level of levels) {
          expect(() => validateLevel(level)).not.toThrow()
          const validated = validateLevel(level)
          expect(validated.operator).toBe('addition')
          expect(validated.pacingTag).toBeDefined()
          expect(['easy', 'normal', 'challenge']).toContain(validated.pacingTag)
        }
      })
    }
  })
})
