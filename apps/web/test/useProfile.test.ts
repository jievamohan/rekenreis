import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useProfile } from '../composables/useProfile'

const getItem = vi.fn()
const setItem = vi.fn()

describe('useProfile', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem, setItem, removeItem: vi.fn() })
    vi.stubGlobal('window', { localStorage: { getItem, setItem, removeItem: vi.fn() } })
    getItem.mockReset()
    setItem.mockReset()
    getItem.mockImplementation(() => null)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns activeProfile from migrated default', () => {
    const { activeProfile, profiles } = useProfile()
    expect(activeProfile.value).not.toBeNull()
    expect(activeProfile.value?.name).toBe('Player 1')
    expect(profiles.value).toHaveLength(1)
  })

  it('createProfile adds profile and switches to it', () => {
    const { createProfile, activeProfile, profiles } = useProfile()
    const before = profiles.value.length
    createProfile('Kid', 'star')
    expect(profiles.value).toHaveLength(before + 1)
    expect(activeProfile.value?.name).toBe('Kid')
    expect(activeProfile.value?.avatarId).toBe('star')
  })

  it('switchProfile changes activeProfile', () => {
    const { createProfile, switchProfile, activeProfile } = useProfile()
    createProfile('A', 'default')
    const firstId = activeProfile.value!.id
    createProfile('B', 'heart')
    expect(activeProfile.value?.name).toBe('B')
    switchProfile(firstId)
    expect(activeProfile.value?.name).toBe('A')
  })

  it('updateProfile updates profile data', () => {
    const { activeProfile, updateProfile } = useProfile()
    const id = activeProfile.value!.id
    updateProfile(id, { name: 'Updated' })
    expect(activeProfile.value?.name).toBe('Updated')
  })
})
