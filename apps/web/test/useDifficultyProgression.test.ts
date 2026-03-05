import { describe, test, expect } from 'vitest'
import { useDifficultyProgression, chapterFromLevel } from '~/composables/useDifficultyProgression'

describe('chapterFromLevel', () => {
  test('levels 1-3 are chapter 1', () => {
    expect(chapterFromLevel(1)).toBe(1)
    expect(chapterFromLevel(2)).toBe(1)
    expect(chapterFromLevel(3)).toBe(1)
  })

  test('levels 4-6 are chapter 2', () => {
    expect(chapterFromLevel(4)).toBe(2)
    expect(chapterFromLevel(6)).toBe(2)
  })

  test('levels 7-9 are chapter 3', () => {
    expect(chapterFromLevel(7)).toBe(3)
    expect(chapterFromLevel(9)).toBe(3)
  })
})

describe('useDifficultyProgression', () => {
  const { getMathRange, getMinigameParams } = useDifficultyProgression()

  describe('getMathRange', () => {
    test('early levels have small operand range', () => {
      const range = getMathRange(1)
      expect(range.operandMax).toBeLessThanOrEqual(5)
      expect(range.choiceCount).toBe(3)
    })

    test('mid levels scale up', () => {
      const range = getMathRange(5)
      expect(range.operandMax).toBeLessThanOrEqual(10)
    })

    test('later levels go to 15', () => {
      const range = getMathRange(8)
      expect(range.operandMax).toBeLessThanOrEqual(15)
    })

    test('highest levels reach 20', () => {
      const range = getMathRange(30)
      expect(range.operandMax).toBe(20)
    })

    test('difficulty ceiling caps operandMax', () => {
      const range = getMathRange(30, 10)
      expect(range.operandMax).toBe(10)
    })

    test('difficulty ceiling does not increase range', () => {
      const range = getMathRange(1, 100)
      expect(range.operandMax).toBe(5)
    })
  })

  describe('getMinigameParams', () => {
    test('bubble-pop params exist and scale', () => {
      const early = getMinigameParams('bubble-pop', 1, 30)
      const late = getMinigameParams('bubble-pop', 30, 30)
      expect(early.bubbleCount).toBeDefined()
      expect(late.bubbleCount).toBeGreaterThanOrEqual(early.bubbleCount)
    })

    test('fish-feed timer decreases with level', () => {
      const early = getMinigameParams('fish-feed', 1, 30)
      const late = getMinigameParams('fish-feed', 30, 30)
      expect(early.timerSeconds).toBeGreaterThan(late.timerSeconds)
    })

    test('returns empty object for unknown minigame', () => {
      const params = getMinigameParams('nonexistent' as never, 1)
      expect(params).toEqual({})
    })

    test('t is clamped between 0 and 1', () => {
      const p1 = getMinigameParams('bubble-pop', 0, 30)
      const p2 = getMinigameParams('bubble-pop', 100, 30)
      expect(p1.bubbleCount).toBeDefined()
      expect(p2.bubbleCount).toBeDefined()
    })
  })
})
