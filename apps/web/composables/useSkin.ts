import type { SkinDefinition } from '~/types/skin'
import type { SkinId } from '~/utils/skinResolver'
import { resolveSkinId } from '~/utils/skinResolver'
import SkinClassic from '~/components/skins/SkinClassic.vue'
import SkinMonsterFeed from '~/components/skins/SkinMonsterFeed.vue'

const REGISTRY: Record<SkinId, SkinDefinition> = {
  classic: { id: 'classic', component: SkinClassic },
  'monster-feed': { id: 'monster-feed', component: SkinMonsterFeed },
}

/**
 * Resolves skin id to skin definition.
 * Unknown ids fall back to classic.
 */
export function useSkin(skinId: string | undefined): SkinDefinition {
  const id = resolveSkinId(skinId)
  return REGISTRY[id]
}
