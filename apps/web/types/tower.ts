/**
 * Tower puzzle: single tower with target and blocks.
 * Guaranteed: at least one pair (a, b) in blocks has a + b = target.
 */
export interface TowerPuzzle {
  target: number
  blocks: number[]
}

/**
 * Configuration for a tower level (one tower per round).
 */
export interface TowerLevelConfig {
  /** Number of rounds (towers) in this level */
  rounds: number
  /** Star thresholds [for 1 star, 2 stars, 3 stars] based on correct rounds */
  starThresholds?: [number, number, number]
  /** Target number range [min, max] for generated puzzles */
  targetRange: [number, number]
  /** Number of blocks in each tower pool */
  blockPoolSize: number
}

/**
 * A single round: one tower puzzle.
 */
export type TowerRound = TowerPuzzle[]
