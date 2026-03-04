import type { InteractionModeId } from '~/types/mode'

const INTERACTION_IDS: InteractionModeId[] = ['classic', 'timed-pop', 'build-bridge']

/**
 * Resolve interaction mode from query param.
 * - mode=classic | mode=timed-pop → that mode
 * - mode=pack (legacy content) or unknown → classic
 */
export function resolveInteractionMode(
  modeParam: string | undefined
): InteractionModeId {
  const normalized = (modeParam || '').toLowerCase().replace(/_/g, '-')
  return INTERACTION_IDS.includes(normalized as InteractionModeId)
    ? (normalized as InteractionModeId)
    : 'classic'
}
