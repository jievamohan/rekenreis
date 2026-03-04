import { describe, it, expect } from 'vitest'
import { generateAdditionQuestion } from '../utils/questionGenerator'

describe('generateAdditionQuestion', () => {
  describe('correctness', () => {
    it('returns correct a + b = correctAnswer for upTo10', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateAdditionQuestion('upTo10')
        expect(q.a + q.b).toBe(q.correctAnswer)
      }
    })

    it('returns correct a + b = correctAnswer for upTo20', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateAdditionQuestion('upTo20')
        expect(q.a + q.b).toBe(q.correctAnswer)
      }
    })

    it('upTo10: sum is at most 10', () => {
      for (let i = 0; i < 100; i++) {
        const q = generateAdditionQuestion('upTo10')
        expect(q.a + q.b).toBeLessThanOrEqual(10)
      }
    })

    it('upTo20: sum is at most 20', () => {
      for (let i = 0; i < 100; i++) {
        const q = generateAdditionQuestion('upTo20')
        expect(q.a + q.b).toBeLessThanOrEqual(20)
      }
    })
  })

  describe('choice uniqueness', () => {
    it('all choices are unique', () => {
      for (let i = 0; i < 50; i++) {
        const q1 = generateAdditionQuestion('upTo10')
        const q2 = generateAdditionQuestion('upTo20')
        expect(new Set(q1.choices).size).toBe(q1.choices.length)
        expect(new Set(q2.choices).size).toBe(q2.choices.length)
      }
    })

    it('choices include exactly one correct answer', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateAdditionQuestion('upTo10')
        const correctCount = q.choices.filter((c) => c === q.correctAnswer).length
        expect(correctCount).toBe(1)
      }
    })

    it('choices has 3 or 4 elements', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateAdditionQuestion('upTo10')
        expect(q.choices.length).toBeGreaterThanOrEqual(3)
        expect(q.choices.length).toBeLessThanOrEqual(4)
      }
    })
  })

  describe('determinism with seeded rng', () => {
    it('same seed produces same question', () => {
      let n = 0
      const rng = () => ((n += 0.1) % 1)
      const q1 = generateAdditionQuestion('upTo10', rng)
      n = 0
      const q2 = generateAdditionQuestion('upTo10', rng)
      expect(q1).toEqual(q2)
    })
  })
})
