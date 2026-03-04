import type { Level, PacingTag } from '~/types/level'
import { createSeededRng } from './seedableRng'

/**
 * Resolve effective pacing tag for a level (derives from difficultyTag if absent).
 */
export function effectivePacingTag(level: Level): PacingTag {
  if (level.pacingTag) return level.pacingTag
  const d = level.difficultyTag?.toLowerCase() ?? 'medium'
  if (d === 'easy') return 'easy'
  if (d === 'hard' || d === 'challenge') return 'challenge'
  return 'normal'
}

function shuffleWithRng<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Apply pacing to a level pack: reorder so no two consecutive levels have pacingTag 'challenge'.
 * Deterministic: same levels + seed => same output.
 */
export function applyPacing(levels: Level[], seed: number): Level[] {
  if (levels.length === 0) return []
  const rng = createSeededRng(seed)

  const easy: Level[] = []
  const normal: Level[] = []
  const challenge: Level[] = []
  for (const l of levels) {
    const tag = effectivePacingTag(l)
    if (tag === 'easy') easy.push(l)
    else if (tag === 'challenge') challenge.push(l)
    else normal.push(l)
  }

  const challenges = shuffleWithRng(challenge, rng)
  const nonChallenges = shuffleWithRng([...easy, ...normal], rng)

  if (challenges.length === 0) return nonChallenges
  if (challenges.length > nonChallenges.length + 1) {
    const excess = challenges.splice(nonChallenges.length + 1)
    nonChallenges.push(...excess)
  }

  const total = challenges.length + nonChallenges.length
  const result: Level[] = new Array(total)
  const challengePositions: number[] = []
  for (let i = 0; i < challenges.length; i++) {
    challengePositions.push(2 * i)
  }
  const otherPositions = [...Array(total).keys()].filter(
    (i) => !challengePositions.includes(i)
  )

  for (let i = 0; i < challenges.length; i++) {
    result[challengePositions[i]] = challenges[i]
  }
  for (let i = 0; i < nonChallenges.length; i++) {
    result[otherPositions[i]] = nonChallenges[i]
  }
  return result
}
