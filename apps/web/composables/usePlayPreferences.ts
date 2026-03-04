import { ref, readonly } from 'vue'
import type { InteractionModeId } from '~/types/mode'
import type { SkinId } from '~/utils/skinResolver'

const LAST_MODE_KEY = 'rekenreis_last_mode'
const LAST_SKIN_KEY = 'rekenreis_last_skin'

const VALID_MODES = ['classic', 'timed-pop', 'build-bridge'] as const
const VALID_SKINS = ['classic', 'monster-feed', 'space', 'pirate'] as const

function getStoredMode(): InteractionModeId {
  if (typeof window === 'undefined') return 'classic'
  const raw = localStorage.getItem(LAST_MODE_KEY)
  if (!raw) return 'classic'
  const normalized = raw.toLowerCase().replace(/_/g, '-')
  return VALID_MODES.includes(normalized as InteractionModeId)
    ? (normalized as InteractionModeId)
    : 'classic'
}

function getStoredSkin(): SkinId {
  if (typeof window === 'undefined') return 'classic'
  const raw = localStorage.getItem(LAST_SKIN_KEY)
  if (!raw) return 'classic'
  const normalized = raw.toLowerCase().replace(/_/g, '-')
  return VALID_SKINS.includes(normalized as SkinId) ? (normalized as SkinId) : 'classic'
}

export function usePlayPreferences() {
  const lastMode = ref<InteractionModeId>(getStoredMode())
  const lastSkin = ref<SkinId>(getStoredSkin())

  function setLastMode(mode: InteractionModeId) {
    lastMode.value = mode
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_MODE_KEY, mode)
    }
  }

  function setLastSkin(skin: SkinId) {
    lastSkin.value = skin
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_SKIN_KEY, skin)
    }
  }

  function setPreferences(mode: InteractionModeId, skin: SkinId) {
    setLastMode(mode)
    setLastSkin(skin)
  }

  return {
    lastMode: readonly(lastMode),
    lastSkin: readonly(lastSkin),
    setLastMode,
    setLastSkin,
    setPreferences,
  }
}
