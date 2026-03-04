import type { Component } from 'vue'
import type { AdditionQuestion, GameMode } from './game'
import type { PlayFeedback } from '~/composables/usePlayGame'

/** Hint type for adaptive assistance */
export type HintType = 'dots' | 'number-line'

/**
 * Props passed to each skin component.
 * Skin receives round state and callbacks; no game logic.
 */
export interface SkinRoundProps {
  question: AdditionQuestion | null
  feedback: PlayFeedback | null
  score: number
  streak: number
  mode: GameMode
  onAnswer: (choice: number) => void
  onNext: () => void
  onModeChange: (mode: GameMode) => void
  /** When set, show this hint visual (after 2 wrong) */
  hintToShow?: HintType | null
  /** Question data for hint (a, b, correctAnswer) */
  hintQuestion?: { a: number; b: number; correctAnswer: number } | null
  /** If false, do not show hints even when hintToShow is set */
  hintsOn?: boolean
}

/** Skin definition: id + Vue component */
export interface SkinDefinition {
  id: string
  component: Component
}
