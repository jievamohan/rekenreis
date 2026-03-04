import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { useRoundOutcome } from '../composables/useRoundOutcome'

describe('useRoundOutcome', () => {
  const mockUpdate = vi.fn()

  beforeEach(() => {
    mockUpdate.mockClear()
  })

  it('recordRoundOutcome increments totalRounds and totalCorrect for correct', () => {
    const profile = {
      activeProfile: ref({ id: 'p1', progress: { bestScore: 0 } }),
      updateProfile: mockUpdate,
    }
    const { recordRoundOutcome } = useRoundOutcome(profile)
    recordRoundOutcome('correct', 'classic')
    expect(mockUpdate).toHaveBeenCalledWith('p1', {
      progress: {
        bestScore: 0,
        totalRounds: 1,
        totalCorrect: 1,
        totalWrong: 0,
        totalTimeout: 0,
        modeCounts: { classic: 1 },
      },
    })
  })

  it('recordRoundOutcome increments totalWrong for wrong', () => {
    const profile = {
      activeProfile: ref({ id: 'p1', progress: { bestScore: 0 } }),
      updateProfile: mockUpdate,
    }
    const { recordRoundOutcome } = useRoundOutcome(profile)
    recordRoundOutcome('wrong', 'timed-pop')
    expect(mockUpdate).toHaveBeenCalledWith('p1', {
      progress: {
        bestScore: 0,
        totalRounds: 1,
        totalCorrect: 0,
        totalWrong: 1,
        totalTimeout: 0,
        modeCounts: { 'timed-pop': 1 },
      },
    })
  })

  it('recordRoundOutcome increments totalTimeout for timeout', () => {
    const profile = {
      activeProfile: ref({ id: 'p1', progress: { bestScore: 0 } }),
      updateProfile: mockUpdate,
    }
    const { recordRoundOutcome } = useRoundOutcome(profile)
    recordRoundOutcome('timeout', 'build-bridge')
    expect(mockUpdate).toHaveBeenCalledWith('p1', {
      progress: {
        bestScore: 0,
        totalRounds: 1,
        totalCorrect: 0,
        totalWrong: 0,
        totalTimeout: 1,
        modeCounts: { 'build-bridge': 1 },
      },
    })
  })

  it('recordRoundOutcome accumulates across calls', () => {
    const activeProfile = ref({
      id: 'p1',
      progress: {
        bestScore: 5,
        totalRounds: 2,
        totalCorrect: 1,
        totalWrong: 1,
        totalTimeout: 0,
        modeCounts: { classic: 2 },
      },
    })
    const profile = {
      activeProfile,
      updateProfile: mockUpdate,
    }
    const { recordRoundOutcome } = useRoundOutcome(profile)
    recordRoundOutcome('correct', 'classic')
    expect(mockUpdate).toHaveBeenCalledWith('p1', {
      progress: expect.objectContaining({
        totalRounds: 3,
        totalCorrect: 2,
        totalWrong: 1,
        totalTimeout: 0,
        modeCounts: { classic: 3 },
      }),
    })
  })

  it('recordRoundOutcome does nothing when profile is undefined', () => {
    const { recordRoundOutcome } = useRoundOutcome(undefined)
    recordRoundOutcome('correct', 'classic')
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('recordRoundOutcome initializes aggregates when missing', () => {
    const profile = {
      activeProfile: ref({ id: 'p1', progress: { bestScore: 10 } }),
      updateProfile: mockUpdate,
    }
    const { recordRoundOutcome } = useRoundOutcome(profile)
    recordRoundOutcome('wrong', 'timed-pop')
    expect(mockUpdate).toHaveBeenCalledWith('p1', {
      progress: {
        bestScore: 10,
        totalRounds: 1,
        totalCorrect: 0,
        totalWrong: 1,
        totalTimeout: 0,
        modeCounts: { 'timed-pop': 1 },
      },
    })
  })
})
