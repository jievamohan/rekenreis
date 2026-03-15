import type { InteractionModeId } from '~/types/mode'
import type { MaatjeId } from '~/types/maatje'
import type { SkinId } from '~/utils/skinResolver'

const STORAGE_KEY = 'rekenreis_profiles_v1'
const LEGACY_PROGRESS_KEY = 'rekenreis_progress'
const LEGACY_BEST_SCORE_KEY = 'rekenreis_best_score'
const LEGACY_MODE_KEY = 'rekenreis_last_mode'
const LEGACY_SKIN_KEY = 'rekenreis_last_skin'
const LEGACY_TELEMETRY_KEY = 'rekenreis_telemetry_opt_out'

export type AvatarId = 'default' | 'star' | 'heart' | 'circle' | 'square'
export type GameMode = 'upTo10' | 'upTo20'

export interface LevelStars {
  stars: number
}

export interface ProfileProgress {
  bestScore: number
  dailyGoal?: { date: string; roundsPlayed: number }
  /** Cumulative aggregates for progress summary (Epic 13) */
  totalRounds?: number
  totalCorrect?: number
  totalWrong?: number
  totalTimeout?: number
  modeCounts?: Partial<Record<InteractionModeId, number>>
  /** Per-level completion — level index (1-based) → stars (1–3) */
  levelProgress?: Record<number, LevelStars>
  /** Highest unlocked level (1-based). Defaults to 1. */
  currentLevel?: number
}

export interface ProfilePrefs {
  lastMode: InteractionModeId
  lastSkin: SkinId
  difficultyCeiling: GameMode
  hintsOn: boolean
  soundOn: boolean
  timersDisabled: boolean
}

export interface ProfileData {
  id: string
  name: string
  avatarId: AvatarId
  /** Maatje character for map/level-complete. Default 'wolkje'. */
  maatjeId?: MaatjeId
  progress: ProfileProgress
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
const VALID_MAATJES: MaatjeId[] = ['wolkje', 'een-oog-eerlijk', 'slimme-rekenaar']

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
    timersDisabled: false,
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
    name: 'Speler 1',
    avatarId: 'default',
    maatjeId: 'wolkje',
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
    name: 'Speler 1',
    avatarId: 'default',
    maatjeId: 'wolkje',
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
      (p.maatjeId === undefined || VALID_MAATJES.includes(p.maatjeId as MaatjeId)) &&
      p.progress &&
      typeof p.progress.bestScore === 'number' &&
      (p.progress.dailyGoal === undefined ||
        (typeof p.progress.dailyGoal?.date === 'string' &&
          typeof p.progress.dailyGoal?.roundsPlayed === 'number')) &&
      (p.progress.totalRounds === undefined || (typeof p.progress.totalRounds === 'number' && p.progress.totalRounds >= 0)) &&
      (p.progress.totalCorrect === undefined || (typeof p.progress.totalCorrect === 'number' && p.progress.totalCorrect >= 0)) &&
      (p.progress.totalWrong === undefined || (typeof p.progress.totalWrong === 'number' && p.progress.totalWrong >= 0)) &&
      (p.progress.totalTimeout === undefined || (typeof p.progress.totalTimeout === 'number' && p.progress.totalTimeout >= 0)) &&
      (p.progress.modeCounts === undefined ||
        (typeof p.progress.modeCounts === 'object' &&
          p.progress.modeCounts !== null &&
          Object.values(p.progress.modeCounts).every((v) => typeof v === 'number' && v >= 0))) &&
      (p.progress.levelProgress === undefined ||
        (typeof p.progress.levelProgress === 'object' &&
          p.progress.levelProgress !== null &&
          Object.entries(p.progress.levelProgress).every(
            ([k, v]) =>
              Number.isFinite(Number(k)) &&
              typeof v === 'object' &&
              v !== null &&
              typeof (v as LevelStars).stars === 'number' &&
              (v as LevelStars).stars >= 0 &&
              (v as LevelStars).stars <= 3
          ))) &&
      (p.progress.currentLevel === undefined ||
        (typeof p.progress.currentLevel === 'number' && p.progress.currentLevel >= 1)) &&
      p.prefs &&
      VALID_MODES.includes(p.prefs.lastMode as InteractionModeId) &&
      VALID_SKINS.includes(p.prefs.lastSkin as SkinId) &&
      typeof p.prefs.difficultyCeiling === 'string' &&
      typeof p.prefs.hintsOn === 'boolean' &&
      (typeof p.prefs.soundOn === 'boolean' || p.prefs.soundOn === undefined) &&
      (typeof p.prefs.timersDisabled === 'boolean' || p.prefs.timersDisabled === undefined) &&
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
      for (const p of data.profiles) {
        if (p.maatjeId === undefined) {
          p.maatjeId = 'wolkje'
        }
        if (p.prefs && p.prefs.soundOn === undefined) {
          p.prefs.soundOn = true
        }
        if (p.prefs && p.prefs.timersDisabled === undefined) {
          p.prefs.timersDisabled = false
        }
        if (p.progress.currentLevel === undefined) {
          p.progress.currentLevel = 1
        }
        if (p.progress.levelProgress === undefined) {
          p.progress.levelProgress = {}
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
    name: 'Speler 1',
    avatarId: 'default',
    maatjeId: 'wolkje',
    progress: { bestScore: 0 },
    prefs: defaultPrefs(),
    telemetryOptOut: true,
  }
}

/** Create schema for API-backed user. If apiProgress is valid ProfileSchemaV1, use it; else create fresh with kindnaam. */
export function createSchemaForUser(kindnaam: string, apiProgress?: unknown): ProfileSchemaV1 {
  if (apiProgress && isValidV1(apiProgress)) {
    const schema = apiProgress as ProfileSchemaV1
    for (const p of schema.profiles) {
      if (p.maatjeId === undefined) p.maatjeId = 'wolkje'
      if (p.prefs?.soundOn === undefined) p.prefs.soundOn = true
      if (p.prefs?.timersDisabled === undefined) p.prefs.timersDisabled = false
      if (p.progress.currentLevel === undefined) p.progress.currentLevel = 1
      if (p.progress.levelProgress === undefined) p.progress.levelProgress = {}
    }
    return schema
  }
  const profile: ProfileData = {
    id: 'api_profile',
    name: kindnaam.slice(0, 50) || 'Speler 1',
    avatarId: 'default',
    maatjeId: 'wolkje',
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
