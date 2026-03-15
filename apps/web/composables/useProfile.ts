import { computed, readonly } from 'vue'
import type { MaatjeId } from '~/types/maatje'
import {
  saveProfiles,
  createDefaultProfile,
  type ProfileSchemaV1,
  type ProfileData,
} from '../utils/profileSchema'
import { useProfileSchema } from './useProfileSchema'
import { useAuth } from './useAuth'

export function useProfile() {
  const schema = useProfileSchema()
  const { user } = useAuth()

  const activeProfile = computed<ProfileData | null>(() => {
    const s = schema.value
    if (!s) return null
    const p = s.profiles.find((x: ProfileData) => x.id === s.activeProfileId)
    return p ?? s.profiles[0] ?? null
  })

  function persist(next: ProfileSchemaV1) {
    if (!user.value) {
      saveProfiles(next)
    }
    // When authenticated, useProgressSync plugin persists to API via watch
  }

  function switchProfile(id: string) {
    const s = schema.value
    if (!s) return
    const profile = s.profiles.find((p: ProfileData) => p.id === id)
    if (!profile) return
    const next: ProfileSchemaV1 = { version: 1, activeProfileId: id, profiles: s.profiles }
    schema.value = next
    persist(next)
  }

  function createProfile(name: string, maatjeId: MaatjeId) {
    const s = schema.value
    if (!s) return
    const newProfile = createDefaultProfile()
    newProfile.name = name.slice(0, 50) || 'Speler 1'
    newProfile.maatjeId = maatjeId
    const next: ProfileSchemaV1 = {
      version: 1,
      activeProfileId: newProfile.id,
      profiles: [...s.profiles, newProfile],
    }
    schema.value = next
    persist(next)
  }

  function updateProfile(id: string, updates: Partial<Pick<ProfileData, 'name' | 'avatarId' | 'maatjeId' | 'progress' | 'prefs' | 'telemetryOptOut'>>) {
    const s = schema.value
    if (!s) return
    const idx = s.profiles.findIndex((p: ProfileData) => p.id === id)
    if (idx < 0) return
    const nextProfiles = [...s.profiles]
    nextProfiles[idx] = { ...nextProfiles[idx], ...updates }
    const next: ProfileSchemaV1 = { version: 1, activeProfileId: s.activeProfileId, profiles: nextProfiles }
    schema.value = next
    persist(next)
  }

  return {
    schema: readonly(schema),
    activeProfile,
    profiles: computed(() => schema.value?.profiles ?? []),
    switchProfile,
    createProfile,
    updateProfile,
  }
}
