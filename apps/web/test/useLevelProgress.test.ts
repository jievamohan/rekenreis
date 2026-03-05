import { describe, it, expect, vi } from 'vitest'
import { ref, computed } from 'vue'
import { useLevelProgress } from '../composables/useLevelProgress'
import type { ProfileData, ProfileProgress } from '../utils/profileSchema'

function makeProfile(overrides: Partial<ProfileProgress> = {}): ProfileData {
  return {
    id: 'test-1',
    name: 'Test',
    avatarId: 'default',
    progress: {
      bestScore: 0,
      levelProgress: {},
      currentLevel: 1,
      ...overrides,
    },
    prefs: {
      lastMode: 'classic',
      lastSkin: 'classic',
      difficultyCeiling: 'upTo10',
      hintsOn: true,
      soundOn: true,
    },
    telemetryOptOut: true,
  }
}

function createMockProfile(progress: Partial<ProfileProgress> = {}) {
  const profile = ref<ProfileData | null>(makeProfile(progress))
  const updateProfile = vi.fn((id: string, updates: Partial<Pick<ProfileData, 'progress'>>) => {
    if (profile.value && profile.value.id === id && updates.progress) {
      profile.value = { ...profile.value, progress: updates.progress }
    }
  })
  return {
    activeProfile: computed(() => profile.value),
    updateProfile,
    _profile: profile,
  }
}

describe('useLevelProgress', () => {
  it('returns empty progress for fresh profile', () => {
    const mock = createMockProfile()
    const { levelProgress, currentLevel } = useLevelProgress(mock)
    expect(levelProgress.value).toEqual({})
    expect(currentLevel.value).toBe(1)
  })

  it('reads existing level progress', () => {
    const mock = createMockProfile({
      levelProgress: { 1: { stars: 3 }, 2: { stars: 2 } },
      currentLevel: 3,
    })
    const { levelProgress, currentLevel, starsFor } = useLevelProgress(mock)
    expect(levelProgress.value).toEqual({ 1: { stars: 3 }, 2: { stars: 2 } })
    expect(currentLevel.value).toBe(3)
    expect(starsFor(1)).toBe(3)
    expect(starsFor(2)).toBe(2)
    expect(starsFor(3)).toBe(0)
  })

  it('completes a level and advances currentLevel', () => {
    const mock = createMockProfile()
    const { completeLevel, currentLevel, starsFor } = useLevelProgress(mock)

    completeLevel(1, 3)
    expect(mock.updateProfile).toHaveBeenCalledTimes(1)
    expect(currentLevel.value).toBe(2)
    expect(starsFor(1)).toBe(3)
  })

  it('keeps best stars on replay', () => {
    const mock = createMockProfile({
      levelProgress: { 1: { stars: 3 } },
      currentLevel: 2,
    })
    const { completeLevel, starsFor } = useLevelProgress(mock)

    completeLevel(1, 1)
    expect(starsFor(1)).toBe(3)
  })

  it('upgrades stars on better replay', () => {
    const mock = createMockProfile({
      levelProgress: { 1: { stars: 1 } },
      currentLevel: 2,
    })
    const { completeLevel, starsFor } = useLevelProgress(mock)

    completeLevel(1, 3)
    expect(starsFor(1)).toBe(3)
  })

  it('clamps stars to 1–3', () => {
    const mock = createMockProfile()
    const { completeLevel, starsFor } = useLevelProgress(mock)

    completeLevel(1, 5)
    expect(starsFor(1)).toBe(3)

    completeLevel(2, 0)
    expect(starsFor(2)).toBe(1)
  })

  it('isUnlocked returns true for levels up to currentLevel', () => {
    const mock = createMockProfile({ currentLevel: 3 })
    const { isUnlocked } = useLevelProgress(mock)

    expect(isUnlocked(1)).toBe(true)
    expect(isUnlocked(2)).toBe(true)
    expect(isUnlocked(3)).toBe(true)
    expect(isUnlocked(4)).toBe(false)
  })

  it('does nothing when no active profile', () => {
    const mock = createMockProfile()
    mock._profile.value = null
    const { completeLevel, currentLevel, levelProgress } = useLevelProgress(mock)

    completeLevel(1, 3)
    expect(mock.updateProfile).not.toHaveBeenCalled()
    expect(currentLevel.value).toBe(1)
    expect(levelProgress.value).toEqual({})
  })
})
