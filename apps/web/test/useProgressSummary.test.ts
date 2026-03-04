import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { useProgressSummary } from '../composables/useProgressSummary'

describe('useProgressSummary', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-04T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('returns zeros when no profile', () => {
    const { roundsToday, roundsTotal, accuracy, favoriteMode } = useProgressSummary(undefined)
    expect(roundsToday.value).toBe(0)
    expect(roundsTotal.value).toBe(0)
    expect(accuracy.value).toBe(0)
    expect(favoriteMode.value).toBe('classic')
  })

  it('derives roundsToday from dailyGoal when date matches', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        name: 'Child',
        progress: {
          dailyGoal: { date: '2026-03-04', roundsPlayed: 3 },
        },
      }),
    }
    const { roundsToday } = useProgressSummary(profile)
    expect(roundsToday.value).toBe(3)
  })

  it('roundsToday is 0 when dailyGoal date differs', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        progress: { dailyGoal: { date: '2026-03-03', roundsPlayed: 3 } },
      }),
    }
    const { roundsToday } = useProgressSummary(profile)
    expect(roundsToday.value).toBe(0)
  })

  it('roundsTotal from progress.totalRounds', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        progress: { totalRounds: 42 },
      }),
    }
    const { roundsTotal } = useProgressSummary(profile)
    expect(roundsTotal.value).toBe(42)
  })

  it('accuracy is correct/(correct+wrong) * 100', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        progress: {
          totalCorrect: 8,
          totalWrong: 2,
          totalTimeout: 1,
        },
      }),
    }
    const { accuracy } = useProgressSummary(profile)
    expect(accuracy.value).toBe(80)
  })

  it('accuracy is 0 when no answered rounds', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        progress: { totalCorrect: 0, totalWrong: 0 },
      }),
    }
    const { accuracy } = useProgressSummary(profile)
    expect(accuracy.value).toBe(0)
  })

  it('favoriteMode from modeCounts when present', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        progress: {
          modeCounts: { classic: 2, 'timed-pop': 5, 'build-bridge': 1 },
        },
        prefs: { lastMode: 'classic' as const },
      }),
    }
    const { favoriteMode } = useProgressSummary(profile)
    expect(favoriteMode.value).toBe('timed-pop')
  })

  it('favoriteMode falls back to lastMode when no modeCounts', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        progress: {},
        prefs: { lastMode: 'build-bridge' as const },
      }),
    }
    const { favoriteMode } = useProgressSummary(profile)
    expect(favoriteMode.value).toBe('build-bridge')
  })

  it('buildExportPayload has no id or name', () => {
    const profile = {
      activeProfile: ref({
        id: 'secret-id',
        name: 'Child Name',
        progress: {
          totalRounds: 10,
          totalCorrect: 8,
          totalWrong: 2,
          modeCounts: { classic: 10 },
          dailyGoal: { date: '2026-03-04', roundsPlayed: 5 },
        },
      }),
    }
    const { buildExportPayload } = useProgressSummary(profile)
    const payload = buildExportPayload()
    expect(payload).not.toHaveProperty('id')
    expect(payload).not.toHaveProperty('name')
    expect(payload).toMatchObject({
      roundsToday: 5,
      roundsTotal: 10,
      accuracy: 80,
      favoriteMode: 'classic',
    })
    expect(payload.exportedAt).toBeDefined()
    expect(typeof payload.exportedAt).toBe('string')
  })
})
