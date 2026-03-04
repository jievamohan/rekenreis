import type { InteractionModeId, ModeDefinition } from '~/types/mode'
import ModeClassic from '~/components/modes/ModeClassic.vue'
import ModeTimedPop from '~/components/modes/ModeTimedPop.vue'

const REGISTRY: Record<InteractionModeId, ModeDefinition> = {
  classic: { id: 'classic', component: ModeClassic },
  'timed-pop': { id: 'timed-pop', component: ModeTimedPop },
}

export function useMode(interactionModeId: InteractionModeId): ModeDefinition {
  return REGISTRY[interactionModeId] ?? REGISTRY.classic
}
