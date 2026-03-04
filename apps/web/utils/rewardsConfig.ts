import type { SkinId } from './skinResolver'
import { SKIN_IDS } from './skinResolver'

/** Score threshold to unlock each skin. Lower = unlocked earlier. */
export const UNLOCK_THRESHOLDS: Record<SkinId, number> = {
  classic: 0,
  'monster-feed': 0,
  space: 5,
  pirate: 10,
}

/** Skin ids ordered by unlock threshold (for UI display). */
export const SKIN_ORDER: SkinId[] = [...SKIN_IDS].sort(
  (a, b) => UNLOCK_THRESHOLDS[a] - UNLOCK_THRESHOLDS[b]
)

/** Sticker categories for sticker book. v1: stickers = skins. */
export interface StickerCategory {
  id: string
  label: string
  stickerIds: readonly SkinId[]
}

export const STICKER_CATEGORIES: StickerCategory[] = [
  { id: 'skins', label: 'Skins', stickerIds: SKIN_ORDER },
]
