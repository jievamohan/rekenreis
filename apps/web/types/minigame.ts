import type { Component } from 'vue'

export type MinigameId =
  | 'bubble-pop'
  | 'treasure-dive'
  | 'fish-feed'
  | 'memory-match'
  | 'bouw-de-toren'
  | 'starfish-match'

export const MINIGAME_IDS: readonly MinigameId[] = [
  'bubble-pop',
  'treasure-dive',
  'fish-feed',
  'memory-match',
  'bouw-de-toren',
  'starfish-match',
] as const

export interface MinigameDifficultyKnobs {
  [key: string]: { min: number; max: number }
}

// --- Contract v2 types ---

export type InteractionType =
  | 'tap-choice'
  | 'tap-to-increment'
  | 'drag-drop'
  | 'swipe-match'
  | 'timed-pop'
  | 'sort-into-bins'
  | 'memory-flip'
  | 'trace-numberline'
  | 'build-sequence'

export const INTERACTION_TYPES: readonly InteractionType[] = [
  'tap-choice',
  'tap-to-increment',
  'drag-drop',
  'swipe-match',
  'timed-pop',
  'sort-into-bins',
  'memory-flip',
  'trace-numberline',
  'build-sequence',
] as const

export type RequiredInput = 'pointer' | 'drag' | 'keyboard' | 'swipe' | 'timed-response'

export const REQUIRED_INPUTS: readonly RequiredInput[] = [
  'pointer',
  'drag',
  'keyboard',
  'swipe',
  'timed-response',
] as const

export type LayoutClass =
  | 'layout-float-field'
  | 'layout-dnd-dualzone'
  | 'layout-drag-reef'
  | 'layout-pop-field'
  | 'layout-tap-scene'
  | 'layout-embedded-math'
  | 'layout-sort-bins'
  | 'layout-match-grid'
  | 'layout-sequence-track'
  | 'layout-route-canvas'
  | 'layout-tower-dualzone'

export const LAYOUT_CLASSES: readonly LayoutClass[] = [
  'layout-float-field',
  'layout-dnd-dualzone',
  'layout-drag-reef',
  'layout-pop-field',
  'layout-tap-scene',
  'layout-embedded-math',
  'layout-sort-bins',
  'layout-match-grid',
  'layout-sequence-track',
  'layout-route-canvas',
  'layout-tower-dualzone',
] as const

export interface TimerPolicy {
  enabledByDefault: boolean
  allowDisableInSettings: boolean
  timeoutBehavior: 'hint-continue'
  reducedMotionBehavior: 'degrade' | 'disable'
}

export interface UniqueDifficultyKnob {
  key: string
  min: number
  max: number
  step?: number
  description: string
}

export interface MinigameContractV2 {
  interactionType: InteractionType
  requiredInputs: RequiredInput[]
  timerPolicy: TimerPolicy | null
  uniqueDifficultyKnobs: UniqueDifficultyKnob[]
  layoutClass: LayoutClass
  isNew: boolean
  duplicationJustification?: string
}

export interface MinigameDefinition {
  id: MinigameId
  component: () => Promise<Component>
  difficultyKnobs: MinigameDifficultyKnobs
  contractV2: MinigameContractV2
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
