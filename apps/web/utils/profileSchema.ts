import type { InteractionModeId } from '~/types/mode'
import type { SkinId } from '~/utils/skinResolver'

const STORAGE_KEY = 'rekenreis_profiles_v1'
const LEGACY_PROGRESS_KEY = 'rekenreis_progress'
const LEGACY_BEST_SCORE_KEY = 'rekenreis_best_score'
const LEGACY_MODE_KEY = 'rekenreis_last_mode'
const LEGACY_SKIN_KEY = 'rekenreis_last_skin'
const LEGACY_TELEMETRY_KEY = 'rekenreis_telemetry_opt_out'

export type AvatarId = 'default' | 'star' | 'heart' | 'circle' | 'square'
export type GameMode = 'upTo10' | 'upTo20'

export interface ProfilePrefs {
  lastMode: InteractionModeId
  lastSkin: SkinId
  difficultyCeiling: GameMode
  hintsOn: boolean
  soundOn: boolean
}

export interface ProfileData {
  id: string
  name: string
  avatarId: AvatarId
  progress: { bestScore: number }
  prefs: ProfilePrefs
  telemetryOptOut: boolean
}

export interface ProfileSchemaV1 {
  version: 1
  activeProfileId: string
  profiles: ProfileData[]
}

const VALID_MODES = ['classic', 'timed-pop', 'build-bridge'] as const
const VALID_SKINS = ['classic', 'monster-feed', 'space', 'pirate'] as const
const VALID_AVATARS: AvatarId[] = ['default', 'star', 'heart', 'circle', 'square']

function genId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

function defaultPrefs(): ProfilePrefs {
  return {
    lastMode: 'classic',
    lastSkin: 'classic',
    difficultyCeiling: 'upTo10',
    hintsOn: true,
    soundOn: true,
  }
}

function migrateFromLegacy(): ProfileSchemaV1 {
  if (typeof window === 'undefined') {
    return createFreshSchema()
  }
  let bestScore = 0
  const progressRaw = localStorage.getItem(LEGACY_PROGRESS_KEY)
  if (progressRaw) {
    try {
      const parsed = JSON.parse(progressRaw) as { bestScore?: number }
      if (typeof parsed?.bestScore === 'number' && parsed.bestScore >= 0) {
        bestScore = Math.floor(parsed.bestScore)
      }
    } catch {
      // ignore
    }
  }
  if (bestScore === 0) {
    const legacyRaw = localStorage.getItem(LEGACY_BEST_SCORE_KEY)
    const n = legacyRaw !== null ? Number(legacyRaw) : 0
    bestScore = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0
  }
  const modeRaw = localStorage.getItem(LEGACY_MODE_KEY)
  const lastMode = (VALID_MODES.includes((modeRaw ?? 'classic') as InteractionModeId)
    ? modeRaw
    : 'classic') as InteractionModeId
  const skinRaw = localStorage.getItem(LEGACY_SKIN_KEY)
  const lastSkin = (VALID_SKINS.includes((skinRaw ?? 'classic') as SkinId)
    ? skinRaw
    : 'classic') as SkinId
  const telemetryRaw = localStorage.getItem(LEGACY_TELEMETRY_KEY)
  const telemetryOptOut = telemetryRaw === '1' || telemetryRaw === 'true'

  const prefs = defaultPrefs()
  prefs.lastMode = lastMode
  prefs.lastSkin = lastSkin

  const profile: ProfileData = {
    id: genId(),
    name: 'Player 1',
    avatarId: 'default',
    progress: { bestScore },
    prefs,
    telemetryOptOut,
  }
  return {
    version: 1,
    activeProfileId: profile.id,
    profiles: [profile],
  }
}

function createFreshSchema(): ProfileSchemaV1 {
  const profile: ProfileData = {
    id: genId(),
    name: 'Player 1',
    avatarId: 'default',
    progress: { bestScore: 0 },
    prefs: defaultPrefs(),
    telemetryOptOut: true,
  }
  return {
    version: 1,
    activeProfileId: profile.id,
    profiles: [profile],
  }
}

function isValidV1(data: unknown): data is ProfileSchemaV1 {
  if (
    !data ||
    typeof data !== 'object' ||
    !('version' in data) ||
    (data as ProfileSchemaV1).version !== 1 ||
    !('activeProfileId' in data) ||
    typeof (data as ProfileSchemaV1).activeProfileId !== 'string' ||
    !('profiles' in data) ||
    !Array.isArray((data as ProfileSchemaV1).profiles)
  ) {
    return false
  }
  const schema = data as ProfileSchemaV1
  return schema.profiles.every(
    (p) =>
      p &&
      typeof p.id === 'string' &&
      typeof p.name === 'string' &&
      VALID_AVATARS.includes(p.avatarId as AvatarId) &&
      p.progress &&
      typeof p.progress.bestScore === 'number' &&
      p.prefs &&
      VALID_MODES.includes(p.prefs.lastMode as InteractionModeId) &&
      VALID_SKINS.includes(p.prefs.lastSkin as SkinId) &&
      typeof p.prefs.difficultyCeiling === 'string' &&
      typeof p.prefs.hintsOn === 'boolean' &&
      (typeof p.prefs.soundOn === 'boolean' || p.prefs.soundOn === undefined) &&
      typeof p.telemetryOptOut === 'boolean'
  )
}

export function loadProfiles(): ProfileSchemaV1 {
  if (typeof window === 'undefined') {
    return createFreshSchema()
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return migrateFromLegacy()
  try {
    const data = JSON.parse(raw) as unknown
    if (isValidV1(data)) {
      // Ensure soundOn exists for profiles loaded before Epic 11
      for (const p of data.profiles) {
        if (p.prefs && p.prefs.soundOn === undefined) {
          p.prefs.soundOn = true
        }
      }
      return data
    }
  } catch {
    // invalid
  }
  return migrateFromLegacy()
}

export function saveProfiles(data: ProfileSchemaV1): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function createDefaultProfile(): ProfileData {
  return {
    id: genId(),
    name: 'Player 1',
    avatarId: 'default',
    progress: { bestScore: 0 },
    prefs: defaultPrefs(),
    telemetryOptOut: true,
  }
}
