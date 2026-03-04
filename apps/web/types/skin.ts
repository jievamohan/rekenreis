import type { Component } from 'vue'
import type { AdditionQuestion, GameMode } from './game'
import type { PlayFeedback } from '~/composables/usePlayGame'

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
}

/** Skin definition: id + Vue component */
export interface SkinDefinition {
  id: string
  component: Component
}
