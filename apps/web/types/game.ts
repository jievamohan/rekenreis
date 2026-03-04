/**
 * Game mode for addition questions.
 * Sum of operands is bounded by the mode.
 */
export type GameMode = 'upTo10' | 'upTo20'

/**
 * A single addition question with multiple-choice answers.
 * Structured for future extensibility (levels, skins).
 */
export interface AdditionQuestion {
  a: number
  b: number
  correctAnswer: number
  choices: number[]
}
