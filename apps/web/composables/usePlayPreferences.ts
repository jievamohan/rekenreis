import { ref, readonly, computed } from 'vue'
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

type ProfileApi = {
  activeProfile: { value: { id: string; prefs: { lastMode: InteractionModeId; lastSkin: SkinId } } | null }
  updateProfile: (id: string, u: Record<string, unknown>) => void
}

export function usePlayPreferences(profile?: ProfileApi) {
  const legacyMode = ref<InteractionModeId>(getStoredMode())
  const legacySkin = ref<SkinId>(getStoredSkin())

  const lastMode = computed(() =>
    profile?.activeProfile.value?.prefs?.lastMode ?? legacyMode.value
  )
  const lastSkin = computed(() =>
    profile?.activeProfile.value?.prefs?.lastSkin ?? legacySkin.value
  )

  function setPreferences(mode: InteractionModeId, skin: SkinId) {
    if (profile?.activeProfile.value) {
      profile.updateProfile(profile.activeProfile.value.id, {
        prefs: {
          ...profile.activeProfile.value.prefs,
          lastMode: mode,
          lastSkin: skin,
        },
      })
    } else {
      legacyMode.value = mode
      legacySkin.value = skin
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_MODE_KEY, mode)
        localStorage.setItem(LAST_SKIN_KEY, skin)
      }
    }
  }

  return {
    lastMode: readonly(lastMode),
    lastSkin: readonly(lastSkin),
    setPreferences,
  }
}
