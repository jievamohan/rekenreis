import { describe, it, expect } from 'vitest'
import type { Level } from '../types/level'
import { usePlayGame } from '../composables/usePlayGame'
import { isCorrectFeedback } from '../utils/feedbackHelpers'
import levelsV1 from '../content/levels.v1.json'
import levelsClassic from '../content/levels.classic.v1.json'
import levelsTimedPop from '../content/levels.timed-pop.v1.json'
import levelsBuildBridge from '../content/levels.build-bridge.v1.json'

const levelPack = levelsV1 as Array<{
  operator: 'addition'
  operandMin: number
  operandMax: number
  choiceCount: number
  hintMode: string
  difficultyTag: string
}>

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
    expect(isCorrectFeedback(game.feedback.value) && game.feedback.value!.correct).toBe(true)
  })

  it('incorrect answer resets streak', () => {
    const game = usePlayGame('upTo10')
    const q = game.question.value!
    const wrong = q.choices.find((c) => c !== q.correctAnswer)!
    game.selectAnswer(wrong)
    expect(game.score.value).toBe(0)
    expect(game.streak.value).toBe(0)
    expect(isCorrectFeedback(game.feedback.value) && !game.feedback.value!.correct).toBe(true)
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

  it('source: "infinite" behaves as default', () => {
    const game = usePlayGame('upTo10', { source: 'infinite' })
    expect(game.question.value).not.toBeNull()
    expect(game.question.value!.a + game.question.value!.b).toBe(
      game.question.value!.correctAnswer
    )
  })

  it('recordTimeout sets timeout feedback without score change', () => {
    const game = usePlayGame('upTo10')
    expect(game.question.value).not.toBeNull()
    const scoreBefore = game.score.value
    game.recordTimeout()
    expect(game.feedback.value).not.toBeNull()
    expect(game.feedback.value).toMatchObject({
      type: 'timeout',
      correctAnswer: game.question.value!.correctAnswer,
    })
    expect(game.score.value).toBe(scoreBefore)
  })

  describe('pack mode', () => {
    it('serves questions from level pack', () => {
      const game = usePlayGame('upTo10', {
        source: 'pack',
        levelPack: levelPack.slice(0, 5),
      })
      const q = game.question.value!
      expect(q.a + q.b).toBe(q.correctAnswer)
      expect(q.choices).toContain(q.correctAnswer)
      expect(new Set(q.choices).size).toBe(q.choices.length)
    })

    it('cycles through pack on nextQuestion', () => {
      const pack = levelPack.slice(0, 3)
      const game = usePlayGame('upTo10', { source: 'pack', levelPack: pack })
      const q1 = game.question.value!
      game.nextQuestion()
      const q2 = game.question.value!
      game.nextQuestion()
      const q3 = game.question.value!
      game.nextQuestion()
      const q4 = game.question.value!
      expect(q1).not.toEqual(q2)
      expect(q2).not.toEqual(q3)
      expect(q3).not.toEqual(q4)
      expect(q4.a + q4.b).toBe(q4.correctAnswer)
    })

    it.each([
      ['classic', levelsClassic],
      ['timed-pop', levelsTimedPop],
      ['build-bridge', levelsBuildBridge],
    ] as const)('pack mode works for %s and completes one round', (_name, pack) => {
      const levels = pack as unknown as Level[]
      const game = usePlayGame('upTo10', { source: 'pack', levelPack: levels })
      const q = game.question.value!
      expect(q).not.toBeNull()
      expect(q.a + q.b).toBe(q.correctAnswer)
      game.selectAnswer(q.correctAnswer)
      expect(game.score.value).toBe(1)
      game.nextQuestion()
      expect(game.question.value).not.toBeNull()
    })

    it('uses initialPackIndex to pick the starting level config', () => {
      const customPack: Level[] = [
        {
          operator: 'addition',
          operandMin: 0,
          operandMax: 0,
          choiceCount: 3,
          hintMode: 'none',
          difficultyTag: 'easy',
        },
        {
          operator: 'addition',
          operandMin: 9,
          operandMax: 9,
          choiceCount: 3,
          hintMode: 'none',
          difficultyTag: 'easy',
        },
      ]

      const gameFromStart = usePlayGame('upTo10', {
        source: 'pack',
        levelPack: customPack,
        initialPackIndex: 0,
        packSeed: 1234,
      })
      const gameFromSecond = usePlayGame('upTo10', {
        source: 'pack',
        levelPack: customPack,
        initialPackIndex: 1,
        packSeed: 1234,
      })

      expect(gameFromStart.question.value!.correctAnswer).toBe(0)
      expect(gameFromSecond.question.value!.correctAnswer).toBe(18)
    })
  })
})
