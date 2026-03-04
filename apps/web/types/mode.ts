import type { Component } from 'vue'

/**
 * Interaction mode: how the player interacts with a round.
 * Distinct from skin (visual theme) and GameMode (difficulty: upTo10/upTo20).
 */
export type InteractionModeId = 'classic' | 'timed-pop'

/** Mode definition: id + Vue component */
export interface ModeDefinition {
  id: InteractionModeId
  component: Component
}
