import type { InteractionModeId, ModeDefinition } from '~/types/mode'
import ModeClassic from '~/components/modes/ModeClassic.vue'
import ModeTimedPop from '~/components/modes/ModeTimedPop.vue'
import ModeBuildBridge from '~/components/modes/ModeBuildBridge.vue'

const REGISTRY: Record<InteractionModeId, ModeDefinition> = {
  classic: { id: 'classic', component: ModeClassic },
  'timed-pop': { id: 'timed-pop', component: ModeTimedPop },
  'build-bridge': { id: 'build-bridge', component: ModeBuildBridge },
}

export function useMode(interactionModeId: InteractionModeId): ModeDefinition {
  return REGISTRY[interactionModeId] ?? REGISTRY.classic
}
