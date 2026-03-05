import type { Component } from 'vue'

export type MinigameId =
  | 'bubble-pop'
  | 'treasure-dive'
  | 'fish-feed'
  | 'coral-builder'
  | 'submarine-sort'
  | 'starfish-match'

export const MINIGAME_IDS: readonly MinigameId[] = [
  'bubble-pop',
  'treasure-dive',
  'fish-feed',
  'coral-builder',
  'submarine-sort',
  'starfish-match',
] as const

export interface MinigameDifficultyKnobs {
  [key: string]: { min: number; max: number }
}

export interface MinigameDefinition {
  id: MinigameId
  component: () => Promise<Component>
  difficultyKnobs: MinigameDifficultyKnobs
}

export interface MinigameMapDirectEntry {
  type: 'direct'
  minigameId: MinigameId
}

export interface MinigameMapWeightedEntry {
  type: 'weighted'
  pool: Array<{ minigameId: MinigameId; weight: number }>
}

export type MinigameMapEntry = MinigameMapDirectEntry | MinigameMapWeightedEntry

export interface MinigameMapRule {
  levelMin: number
  levelMax: number
  entry: MinigameMapEntry
}

export interface MinigameMap {
  version: number
  defaultEntry: MinigameMapEntry
  rules: MinigameMapRule[]
}
