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
      expect(result).toEqual(validLevel)
      expect(result.operator).toBe('addition')
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
})
