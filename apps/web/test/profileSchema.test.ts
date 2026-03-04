import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  loadProfiles,
  saveProfiles,
  createDefaultProfile,
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

  it('loads valid v1 schema', () => {
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
    expect(result).toEqual(data)
  })

  it('saveProfiles writes to localStorage', () => {
    const data = loadProfiles()
    saveProfiles(data)
    expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(data))
  })

  it('createDefaultProfile returns valid profile', () => {
    const p = createDefaultProfile()
    expect(p.id).toMatch(/^p_/)
    expect(p.name).toBe('Player 1')
    expect(p.avatarId).toBe('default')
    expect(p.progress.bestScore).toBe(0)
    expect(p.prefs.lastMode).toBe('classic')
    expect(p.prefs.hintsOn).toBe(true)
  })

  it('falls back to migration on invalid JSON', () => {
    getItem.mockImplementation((key: string) =>
      key === STORAGE_KEY ? 'invalid' : null
    )
    const result = loadProfiles()
    expect(result.profiles).toHaveLength(1)
    expect(result.profiles[0].name).toBe('Player 1')
  })
})
