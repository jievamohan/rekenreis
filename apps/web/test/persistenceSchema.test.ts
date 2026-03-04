import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  loadProgress,
  saveProgress,
  SCHEMA_VERSION,
  type ProgressSchemaV1,
} from '../utils/persistenceSchema'

const LEGACY_KEY = 'rekenreis_best_score'
const STORAGE_KEY = 'rekenreis_progress'

const getItem = vi.fn()
const setItem = vi.fn()
const removeItem = vi.fn()

describe('persistenceSchema', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem,
      setItem,
      removeItem,
    })
    vi.stubGlobal('window', { localStorage: { getItem, setItem, removeItem } })
    getItem.mockReset()
    setItem.mockReset()
    removeItem.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('migrates from legacy best_score key', () => {
    getItem.mockImplementation((key: string) => {
      if (key === STORAGE_KEY) return null
      if (key === LEGACY_KEY) return '42'
      return null
    })

    const result = loadProgress()
    expect(result).toEqual({ version: 1, bestScore: 42 })
  })

  it('loads valid v1 schema', () => {
    const data: ProgressSchemaV1 = { version: 1, bestScore: 10 }
    getItem.mockImplementation((key: string) => {
      if (key === STORAGE_KEY) return JSON.stringify(data)
      return null
    })

    const result = loadProgress()
    expect(result).toEqual(data)
  })

  it('migrates on invalid JSON', () => {
    getItem.mockImplementation((key: string) => {
      if (key === STORAGE_KEY) return 'invalid json'
      if (key === LEGACY_KEY) return '7'
      return null
    })

    const result = loadProgress()
    expect(result).toEqual({ version: 1, bestScore: 7 })
  })

  it('saveProgress writes v1 and removes legacy', () => {
    const data: ProgressSchemaV1 = { version: 1, bestScore: 5 }
    saveProgress(data)

    expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(data))
    expect(removeItem).toHaveBeenCalledWith(LEGACY_KEY)
  })

  it('SCHEMA_VERSION is 1', () => {
    expect(SCHEMA_VERSION).toBe(1)
  })

  it('returns default when storage has no data', () => {
    getItem.mockReturnValue(null)

    const result = loadProgress()
    expect(result).toEqual({ version: 1, bestScore: 0 })
  })
})
