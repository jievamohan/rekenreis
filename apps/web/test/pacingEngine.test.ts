import { describe, it, expect } from 'vitest'
import { applyPacing } from '../utils/pacingEngine'
import type { Level } from '../types/level'

const baseLevel: Omit<Level, 'pacingTag' | 'difficultyTag'> = {
  operator: 'addition',
  operandMin: 0,
  operandMax: 10,
  choiceCount: 4,
  hintMode: 'none',
}

function level(tag: 'easy' | 'normal' | 'challenge'): Level {
  return {
    ...baseLevel,
    difficultyTag: tag === 'challenge' ? 'medium' : tag,
    pacingTag: tag,
  }
}

describe('pacingEngine', () => {
  describe('applyPacing', () => {
    it('returns reordered Level[]', () => {
      const levels = [
        level('challenge'),
        level('easy'),
        level('normal'),
        level('challenge'),
        level('easy'),
      ]
      const result = applyPacing(levels, 42)
      expect(result).toHaveLength(5)
      expect(result.every((l) => l.operator === 'addition')).toBe(true)
    })

    it('never has two consecutive challenge levels', () => {
      const levels: Level[] = [
        level('challenge'),
        level('challenge'),
        level('challenge'),
        level('easy'),
        level('easy'),
        level('normal'),
      ]
      const result = applyPacing(levels, 123)
      for (let i = 1; i < result.length; i++) {
        const prev = result[i - 1].pacingTag ?? (result[i - 1] as Level & { pacingTag?: string }).difficultyTag
        const curr = result[i].pacingTag ?? (result[i] as Level & { pacingTag?: string }).difficultyTag
        const prevChallenge = prev === 'challenge'
        const currChallenge = curr === 'challenge'
        expect(prevChallenge && currChallenge).toBe(false)
      }
    })

    it('same seed produces same sequence', () => {
      const levels = [
        level('easy'),
        level('challenge'),
        level('normal'),
        level('challenge'),
        level('easy'),
      ]
      const a = applyPacing(levels, 99)
      const b = applyPacing(levels, 99)
      expect(a).toEqual(b)
    })

    it('different seed can produce different sequence', () => {
      const levels = [
        level('easy'),
        level('challenge'),
        level('normal'),
        level('challenge'),
        level('easy'),
      ]
      const a = applyPacing(levels, 1)
      const b = applyPacing(levels, 2)
      expect(a).not.toEqual(b)
    })

    it('empty array returns empty', () => {
      expect(applyPacing([], 42)).toEqual([])
    })

    it('single level returns as-is', () => {
      const levels = [level('challenge')]
      expect(applyPacing(levels, 42)).toEqual(levels)
    })
  })
})
