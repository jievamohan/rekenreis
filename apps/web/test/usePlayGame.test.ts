import { describe, it, expect } from 'vitest'
import { usePlayGame } from '../composables/usePlayGame'

describe('usePlayGame', () => {
  it('returns reactive state and actions', () => {
    const game = usePlayGame('upTo10')
    expect(game.question.value).not.toBeNull()
    expect(game.score.value).toBe(0)
    expect(game.streak.value).toBe(0)
    expect(game.feedback.value).toBeNull()
    expect(typeof game.selectAnswer).toBe('function')
    expect(typeof game.nextQuestion).toBe('function')
  })

  it('correct answer increments score and streak', () => {
    const game = usePlayGame('upTo10')
    const q = game.question.value!
    game.selectAnswer(q.correctAnswer)
    expect(game.score.value).toBe(1)
    expect(game.streak.value).toBe(1)
    expect(game.feedback.value?.correct).toBe(true)
  })

  it('incorrect answer resets streak', () => {
    const game = usePlayGame('upTo10')
    const q = game.question.value!
    const wrong = q.choices.find((c) => c !== q.correctAnswer)!
    game.selectAnswer(wrong)
    expect(game.score.value).toBe(0)
    expect(game.streak.value).toBe(0)
    expect(game.feedback.value?.correct).toBe(false)
  })

  it('streak accumulates on consecutive correct answers', () => {
    const game = usePlayGame('upTo10')
    const q1 = game.question.value!
    game.selectAnswer(q1.correctAnswer)
    expect(game.streak.value).toBe(1)
    game.nextQuestion()
    const q2 = game.question.value!
    game.selectAnswer(q2.correctAnswer)
    expect(game.streak.value).toBe(2)
  })

  it('nextQuestion loads new question and clears feedback', () => {
    const game = usePlayGame('upTo10')
    const q1 = game.question.value!
    game.selectAnswer(q1.correctAnswer)
    expect(game.feedback.value).not.toBeNull()
    game.nextQuestion()
    expect(game.feedback.value).toBeNull()
    expect(game.question.value).not.toBeNull()
  })

  it('selectAnswer is no-op when already answered', () => {
    const game = usePlayGame('upTo10')
    const q = game.question.value!
    game.selectAnswer(q.correctAnswer)
    const scoreBefore = game.score.value
    game.selectAnswer(q.choices[0])
    expect(game.score.value).toBe(scoreBefore)
  })
})
