import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  loadProfiles,
  saveProfiles,
  createDefaultProfile,
  createSchemaForUser,
  type ProfileSchemaV1,
} from '../utils/profileSchema'

const STORAGE_KEY = 'rekenreis_profiles_v1'
const LEGACY_PROGRESS_KEY = 'rekenreis_progress'
const LEGACY_BEST_SCORE_KEY = 'rekenreis_best_score'

const getItem = vi.fn()
const setItem = vi.fn()
const removeItem = vi.fn()

describe('profileSchema', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem, setItem, removeItem })
    vi.stubGlobal('window', { localStorage: { getItem, setItem, removeItem } })
    getItem.mockReset()
    setItem.mockReset()
    removeItem.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('migrates from legacy progress key', () => {
    getItem.mockImplementation((key: string) => {
      if (key === STORAGE_KEY) return null
      if (key === LEGACY_PROGRESS_KEY) return JSON.stringify({ version: 1, bestScore: 15 })
      return null
    })
    const result = loadProfiles()
    expect(result.profiles).toHaveLength(1)
    expect(result.profiles[0].progress.bestScore).toBe(15)
    expect(result.activeProfileId).toBe(result.profiles[0].id)
  })

  it('migrates from legacy best_score key when progress missing', () => {
    getItem.mockImplementation((key: string) => {
      if (key === STORAGE_KEY) return null
      if (key === LEGACY_PROGRESS_KEY) return null
      if (key === LEGACY_BEST_SCORE_KEY) return '7'
      return null
    })
    const result = loadProfiles()
    expect(result.profiles[0].progress.bestScore).toBe(7)
  })

  it('loads valid v1 schema and migrates level progress fields', () => {
    const profile = createDefaultProfile()
    const data: ProfileSchemaV1 = {
      version: 1,
      activeProfileId: profile.id,
      profiles: [profile],
    }
    getItem.mockImplementation((key: string) =>
      key === STORAGE_KEY ? JSON.stringify(data) : null
    )
    const result = loadProfiles()
    expect(result.version).toBe(1)
    expect(result.activeProfileId).toBe(profile.id)
    expect(result.profiles).toHaveLength(1)
    expect(result.profiles[0].progress.currentLevel).toBe(1)
    expect(result.profiles[0].progress.levelProgress).toEqual({})
  })

  it('saveProfiles writes to localStorage', () => {
    const data = loadProfiles()
    saveProfiles(data)
    expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(data))
  })

  it('createDefaultProfile returns valid profile', () => {
    const p = createDefaultProfile()
    expect(p.id).toMatch(/^p_/)
    expect(p.name).toBe('Speler 1')
    expect(p.avatarId).toBe('default')
    expect(p.progress.bestScore).toBe(0)
    expect(p.prefs.lastMode).toBe('classic')
    expect(p.prefs.hintsOn).toBe(true)
    expect(p.prefs.soundOn).toBe(true)
  })

  it('adds soundOn to v1 profiles missing it (Epic 11 migration)', () => {
    const profile = createDefaultProfile()
    const prefsWithoutSound = { ...profile.prefs }
    delete (prefsWithoutSound as Record<string, unknown>).soundOn
    const legacyProfile = { ...profile, prefs: prefsWithoutSound } as ProfileSchemaV1['profiles'][number]
    const data: ProfileSchemaV1 = {
      version: 1,
      activeProfileId: legacyProfile.id,
      profiles: [legacyProfile],
    }
    getItem.mockImplementation((key: string) =>
      key === STORAGE_KEY ? JSON.stringify(data) : null
    )
    const result = loadProfiles()
    expect(result.profiles[0].prefs.soundOn).toBe(true)
  })

  it('falls back to migration on invalid JSON', () => {
    getItem.mockImplementation((key: string) =>
      key === STORAGE_KEY ? 'invalid' : null
    )
    const result = loadProfiles()
    expect(result.profiles).toHaveLength(1)
    expect(result.profiles[0].name).toBe('Speler 1')
  })

  it('createSchemaForUser returns fresh schema when apiProgress invalid', () => {
    const result = createSchemaForUser('Jan')
    expect(result.profiles).toHaveLength(1)
    expect(result.profiles[0].name).toBe('Jan')
    expect(result.profiles[0].id).toBe('api_profile')
    expect(result.profiles[0].progress.bestScore).toBe(0)
  })

  it('createSchemaForUser uses valid apiProgress when provided', () => {
    const stored: ProfileSchemaV1 = {
      version: 1,
      activeProfileId: 'p1',
      profiles: [{
        id: 'p1',
        name: 'Jan',
        avatarId: 'default',
        maatjeId: 'wolkje',
        progress: { bestScore: 10, currentLevel: 5, levelProgress: { 1: { stars: 3 } } },
        prefs: createDefaultProfile().prefs,
        telemetryOptOut: false,
      }],
    }
    const result = createSchemaForUser('Jan', stored)
    expect(result.profiles).toHaveLength(1)
    expect(result.profiles[0].progress.bestScore).toBe(10)
    expect(result.profiles[0].progress.currentLevel).toBe(5)
    expect(result.profiles[0].progress.levelProgress).toEqual({ 1: { stars: 3 } })
  })
})
