import { createSeededRng } from './seedableRng'
import type { TowerPuzzle, TowerLevelConfig, TowerRound } from '~/types/tower'

/**
 * Generate a single tower puzzle with guarantee of at least one valid solution.
 * Strategy: pick target, ensure (a, target-a) or similar valid pair is in blocks.
 * Same seed + config always produces identical output.
 */
export function generateTowerPuzzle(
  seed: number,
  targetRange: [number, number],
  blockPoolSize: number
): TowerPuzzle {
  const rng = createSeededRng(seed)
  const [minT, maxT] = targetRange
  const target = minT + Math.floor(rng() * (maxT - minT + 1))

  // Guarantee: include (a, target - a) with a in valid range
  const a = Math.floor(rng() * (target + 1))
  const b = target - a
  const solutionPair = [a, b]

  const blocks: number[] = [...solutionPair]
  const used = new Set<number>()
  solutionPair.forEach((n) => used.add(n))

  // Fill remaining slots with distinct numbers (0..target*2 or similar range)
  const maxVal = Math.max(target * 2, 20)
  while (blocks.length < blockPoolSize) {
    const n = Math.floor(rng() * (maxVal + 1))
    if (!used.has(n)) {
      blocks.push(n)
      used.add(n)
    }
  }

  // Shuffle
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[blocks[i], blocks[j]] = [blocks[j], blocks[i]]
  }

  return { target, blocks }
}

/**
 * Generate all rounds for a tower level.
 * Deterministic: same seed + config produces identical output.
 */
export function generateTowerLevel(
  seed: number,
  config: TowerLevelConfig
): TowerRound[] {
  const rounds: TowerRound[] = []
  let s = seed

  for (let r = 0; r < config.rounds; r++) {
    const puzzle = generateTowerPuzzle(
      s++,
      config.targetRange,
      config.blockPoolSize
    )
    rounds.push([puzzle])
  }

  return rounds
}

/**
 * Verify that a tower puzzle has at least one valid solution.
 */
export function hasValidSolution(puzzle: TowerPuzzle): boolean {
  const { target, blocks } = puzzle
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (blocks[i] + blocks[j] === target) return true
    }
  }
  return false
}
