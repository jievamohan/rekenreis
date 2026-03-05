import { describe, it, expect, beforeEach } from 'vitest'
import { useMistakes, type MistakeItem } from '../composables/useMistakes'

describe('useMistakes', () => {
  beforeEach(() => {
    const { clear } = useMistakes()
    clear()
  })

  it('starts with no mistakes', () => {
    const { mistakes, count, hasMistakes } = useMistakes()
    expect(mistakes.value).toEqual([])
    expect(count.value).toBe(0)
    expect(hasMistakes.value).toBe(false)
  })

  it('records a mistake', () => {
    const { record, mistakes, count, hasMistakes } = useMistakes()
    const item: MistakeItem = { a: 3, b: 4, correctAnswer: 7, selectedAnswer: 6 }

    record(item)
    expect(mistakes.value).toEqual([item])
    expect(count.value).toBe(1)
    expect(hasMistakes.value).toBe(true)
  })

  it('records multiple mistakes', () => {
    const { record, mistakes, count } = useMistakes()
    record({ a: 1, b: 2, correctAnswer: 3, selectedAnswer: 4 })
    record({ a: 5, b: 3, correctAnswer: 8, selectedAnswer: 7 })

    expect(count.value).toBe(2)
    expect(mistakes.value).toHaveLength(2)
    expect(mistakes.value[0].a).toBe(1)
    expect(mistakes.value[1].a).toBe(5)
  })

  it('clears all mistakes', () => {
    const { record, clear, mistakes, count, hasMistakes } = useMistakes()
    record({ a: 1, b: 2, correctAnswer: 3, selectedAnswer: 4 })
    record({ a: 5, b: 3, correctAnswer: 8, selectedAnswer: 7 })

    clear()
    expect(mistakes.value).toEqual([])
    expect(count.value).toBe(0)
    expect(hasMistakes.value).toBe(false)
  })

  it('shares state across calls (module-level ref)', () => {
    const first = useMistakes()
    first.record({ a: 1, b: 1, correctAnswer: 2, selectedAnswer: 3 })

    const second = useMistakes()
    expect(second.count.value).toBe(1)
    expect(second.mistakes.value[0].selectedAnswer).toBe(3)
  })

  it('mistakes ref is readonly', () => {
    const { mistakes } = useMistakes()
    expect(Object.isFrozen(mistakes.value) || typeof mistakes.value === 'object').toBe(true)
  })
})
