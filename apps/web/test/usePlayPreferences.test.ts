import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePlayPreferences } from '../composables/usePlayPreferences'

describe('usePlayPreferences', () => {
  const storage: Record<string, string> = {}

  beforeEach(() => {
    Object.keys(storage).forEach((k) => delete storage[k])
    const mockStorage = {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value
      },
      removeItem: (key: string) => {
        delete storage[key]
      },
    }
    vi.stubGlobal('localStorage', mockStorage)
    vi.stubGlobal('window', { localStorage: mockStorage })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns classic defaults when storage empty', () => {
    const prefs = usePlayPreferences()
    expect(prefs.lastMode.value).toBe('classic')
    expect(prefs.lastSkin.value).toBe('classic')
  })

  it('reads stored mode and skin', () => {
    storage.rekenreis_last_mode = 'timed-pop'
    storage.rekenreis_last_skin = 'monster-feed'
    const prefs = usePlayPreferences()
    expect(prefs.lastMode.value).toBe('timed-pop')
    expect(prefs.lastSkin.value).toBe('monster-feed')
  })

  it('setPreferences writes to localStorage', () => {
    const prefs = usePlayPreferences()
    prefs.setPreferences('build-bridge', 'space')
    expect(storage.rekenreis_last_mode).toBe('build-bridge')
    expect(storage.rekenreis_last_skin).toBe('space')
    expect(prefs.lastMode.value).toBe('build-bridge')
    expect(prefs.lastSkin.value).toBe('space')
  })

  it('setPreferences can update mode while keeping skin', () => {
    storage.rekenreis_last_skin = 'pirate'
    const prefs = usePlayPreferences()
    prefs.setPreferences('build-bridge', 'pirate')
    expect(storage.rekenreis_last_mode).toBe('build-bridge')
    expect(storage.rekenreis_last_skin).toBe('pirate')
  })

  it('ignores invalid stored mode', () => {
    storage.rekenreis_last_mode = 'invalid'
    const prefs = usePlayPreferences()
    expect(prefs.lastMode.value).toBe('classic')
  })

  it('ignores invalid stored skin', () => {
    storage.rekenreis_last_skin = 'invalid'
    const prefs = usePlayPreferences()
    expect(prefs.lastSkin.value).toBe('classic')
  })
})
