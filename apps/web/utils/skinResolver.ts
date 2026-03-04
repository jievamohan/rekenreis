/**
 * Pure skin id resolution. No Vue imports.
 * Unknown ids fall back to classic.
 */
export const SKIN_IDS = ['classic', 'monster-feed', 'space', 'pirate'] as const
export type SkinId = (typeof SKIN_IDS)[number]

export function resolveSkinId(skinId: string | undefined): SkinId {
  const normalized = (skinId || 'classic').toLowerCase().replace(/_/g, '-')
  return SKIN_IDS.includes(normalized as SkinId) ? (normalized as SkinId) : 'classic'
}
