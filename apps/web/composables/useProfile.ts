import { ref, computed, readonly } from 'vue'
import {
  loadProfiles,
  saveProfiles,
  createDefaultProfile,
  type ProfileSchemaV1,
  type ProfileData,
  type AvatarId,
} from '../utils/profileSchema'

let schemaRef: ReturnType<typeof ref<ProfileSchemaV1>> | null = null

function getSchemaRef() {
  if (!schemaRef) {
    schemaRef = ref<ProfileSchemaV1>(loadProfiles())
  }
  return schemaRef
}

export function useProfile() {
  const schema = getSchemaRef()

  const activeProfile = computed<ProfileData | null>(() => {
    const s = schema.value
    if (!s) return null
    const p = s.profiles.find((x) => x.id === s.activeProfileId)
    return p ?? s.profiles[0] ?? null
  })

  function switchProfile(id: string) {
    const s = schema.value
    if (!s) return
    const profile = s.profiles.find((p) => p.id === id)
    if (!profile) return
    const next: ProfileSchemaV1 = { version: 1, activeProfileId: id, profiles: s.profiles }
    schema.value = next
    saveProfiles(next)
  }

  function createProfile(name: string, avatarId: AvatarId) {
    const s = schema.value
    if (!s) return
    const newProfile = createDefaultProfile()
    newProfile.name = name.slice(0, 50) || 'Player 1'
    newProfile.avatarId = avatarId
    const next: ProfileSchemaV1 = {
      version: 1,
      activeProfileId: newProfile.id,
      profiles: [...s.profiles, newProfile],
    }
    schema.value = next
    saveProfiles(next)
  }

  function updateProfile(id: string, updates: Partial<Pick<ProfileData, 'name' | 'avatarId' | 'progress' | 'prefs' | 'telemetryOptOut'>>) {
    const s = schema.value
    if (!s) return
    const idx = s.profiles.findIndex((p) => p.id === id)
    if (idx < 0) return
    const nextProfiles = [...s.profiles]
    nextProfiles[idx] = { ...nextProfiles[idx], ...updates }
    const next: ProfileSchemaV1 = { version: 1, activeProfileId: s.activeProfileId, profiles: nextProfiles }
    schema.value = next
    saveProfiles(next)
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
