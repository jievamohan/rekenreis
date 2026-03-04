import type { AdditionQuestion, GameMode } from '~/types/game'

export type RandomFn = () => number

/**
 * Generate an addition question with 3-4 unique multiple-choice answers.
 * @param mode - 'upTo10' (sum ≤ 10) or 'upTo20' (sum ≤ 20)
 * @param rng - Optional random function for testability
 */
export function generateAdditionQuestion(
  mode: GameMode,
  rng: RandomFn = Math.random
): AdditionQuestion {
  const maxSum = mode === 'upTo10' ? 10 : 20

  const a = Math.floor(rng() * (maxSum + 1))
  const b = Math.floor(rng() * (maxSum - a + 1))
  const correctAnswer = a + b

  const distractors = new Set<number>()
  const range = 4
  for (let offset = -range; offset <= range && distractors.size < 3; offset++) {
    if (offset === 0) continue
    const val = correctAnswer + offset
    if (val >= 0 && val !== correctAnswer) {
      distractors.add(val)
    }
  }
  while (distractors.size < 3) {
    const val = Math.floor(rng() * (maxSum + 6))
    if (val >= 0 && val !== correctAnswer) {
      distractors.add(val)
    }
  }

  const choices = [...distractors].slice(0, 3)
  choices.push(correctAnswer)

  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
  }

  return { a, b, correctAnswer, choices }
}
