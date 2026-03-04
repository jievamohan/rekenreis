import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { useDailyGoal } from '../composables/useDailyGoal'

describe('useDailyGoal', () => {
  const mockUpdate = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-04T12:00:00Z'))
    mockUpdate.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('returns roundsPlayed 0 when no dailyGoal', () => {
    const profile = {
      activeProfile: ref({ id: 'p1', progress: { bestScore: 0 } }),
      updateProfile: mockUpdate,
    }
    const { roundsPlayed, goalRounds, isGoalReached } = useDailyGoal(profile)
    expect(roundsPlayed.value).toBe(0)
    expect(goalRounds).toBe(5)
    expect(isGoalReached.value).toBe(false)
  })

  it('returns roundsPlayed from dailyGoal when date matches today', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        progress: {
          bestScore: 5,
          dailyGoal: { date: '2026-03-04', roundsPlayed: 3 },
        },
      }),
      updateProfile: mockUpdate,
    }
    const { roundsPlayed } = useDailyGoal(profile)
    expect(roundsPlayed.value).toBe(3)
  })

  it('returns roundsPlayed 0 when dailyGoal date is different (new day)', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        progress: {
          bestScore: 5,
          dailyGoal: { date: '2026-03-03', roundsPlayed: 3 },
        },
      }),
      updateProfile: mockUpdate,
    }
    const { roundsPlayed } = useDailyGoal(profile)
    expect(roundsPlayed.value).toBe(0)
  })

  it('incrementRound persists with today date', () => {
    const activeProfile = ref({
      id: 'p1',
      progress: { bestScore: 0 },
    })
    const profile = {
      activeProfile,
      updateProfile: mockUpdate,
    }
    const { incrementRound } = useDailyGoal(profile)
    incrementRound()
    expect(mockUpdate).toHaveBeenCalledWith('p1', {
      progress: {
        bestScore: 0,
        dailyGoal: { date: '2026-03-04', roundsPlayed: 1 },
      },
    })
  })

  it('incrementRound does nothing when profile is undefined', () => {
    const { incrementRound } = useDailyGoal(undefined)
    incrementRound()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('isGoalReached when roundsPlayed >= 5', () => {
    const profile = {
      activeProfile: ref({
        id: 'p1',
        progress: {
          bestScore: 5,
          dailyGoal: { date: '2026-03-04', roundsPlayed: 5 },
        },
      }),
      updateProfile: mockUpdate,
    }
    const { isGoalReached } = useDailyGoal(profile)
    expect(isGoalReached.value).toBe(true)
  })
})
