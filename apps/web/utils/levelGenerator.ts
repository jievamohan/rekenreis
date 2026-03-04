import type { AdditionQuestion } from '../types/game'
import type { Level } from '../types/level'
import { createSeededRng } from './seedableRng'
import type { RandomFn } from './questionGenerator'

export interface LevelPackConfig {
  count?: number
  operandMin?: number
  operandMax?: number
  choiceCount?: number
}

const DEFAULT_CONFIG: Required<LevelPackConfig> = {
  count: 50,
  operandMin: 0,
  operandMax: 10,
  choiceCount: 4,
}

/**
 * Generate a deterministic pack of Level definitions.
 * Same seed + config always produces identical output.
 */
export function generateLevelPack(
  seed: number,
  config: LevelPackConfig = {}
): Level[] {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const rng = createSeededRng(seed)
  const levels: Level[] = []

  const operandMaxOptions = [5, 10, 15, 20]
  const choiceCountOptions = [3, 4]
  const difficultyTags = ['easy', 'medium']

  for (let i = 0; i < cfg.count; i++) {
    const operandMax =
      operandMaxOptions[Math.floor(rng() * operandMaxOptions.length)]
    const operandMin = Math.floor(rng() * Math.min(3, operandMax))
    const choiceCount =
      choiceCountOptions[Math.floor(rng() * choiceCountOptions.length)]
    const difficultyTag =
      difficultyTags[Math.floor(rng() * difficultyTags.length)]

    levels.push({
      operator: 'addition',
      operandMin,
      operandMax,
      choiceCount,
      hintMode: 'none',
      difficultyTag,
    })
  }

  return levels
}

/**
 * Generate a single AdditionQuestion from a Level.
 * Uses provided rng for determinism.
 */
export function generateQuestionFromLevel(
  level: Level,
  rng: RandomFn = Math.random
): AdditionQuestion {
  const range = level.operandMax - level.operandMin + 1
  const a = level.operandMin + Math.floor(rng() * range)
  const b = level.operandMin + Math.floor(rng() * range)
  const correctAnswer = a + b

  const distractors = new Set<number>()
  const maxAttempts = 50
  let attempts = 0
  while (distractors.size < level.choiceCount - 1 && attempts < maxAttempts) {
    const offset = Math.floor(rng() * 9) - 4
    const val = correctAnswer + offset
    if (val >= 0 && val !== correctAnswer) {
      distractors.add(val)
    }
    attempts++
  }
  while (distractors.size < level.choiceCount - 1) {
    const val = Math.floor(rng() * (level.operandMax * 2 + 6))
    if (val >= 0 && val !== correctAnswer) {
      distractors.add(val)
    }
  }

  const choices = [...distractors].slice(0, level.choiceCount - 1)
  choices.push(correctAnswer)

  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
  }

  return { a, b, correctAnswer, choices }
}
