const STORAGE_KEY = 'rekenreis_progress'
const LEGACY_KEY = 'rekenreis_best_score'

export const SCHEMA_VERSION = 1

export interface ProgressSchemaV1 {
  version: 1
  bestScore: number
}

export type ProgressSchema = ProgressSchemaV1

function isValidV1(data: unknown): data is ProgressSchemaV1 {
  return (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    (data as ProgressSchemaV1).version === 1 &&
    'bestScore' in data &&
    typeof (data as ProgressSchemaV1).bestScore === 'number'
  )
}

function migrateFromLegacy(): ProgressSchemaV1 {
  if (typeof window === 'undefined') {
    return { version: 1, bestScore: 0 }
  }
  const raw = localStorage.getItem(LEGACY_KEY)
  const n = raw !== null ? Number(raw) : 0
  const bestScore = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0
  return { version: 1, bestScore }
}

export function loadProgress(): ProgressSchemaV1 {
  if (typeof window === 'undefined') {
    return { version: 1, bestScore: 0 }
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return migrateFromLegacy()
  try {
    const data = JSON.parse(raw) as unknown
    if (isValidV1(data)) return data
  } catch {
    // invalid JSON
  }
  return migrateFromLegacy()
}

export function saveProgress(data: ProgressSchemaV1): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  localStorage.removeItem(LEGACY_KEY)
}
