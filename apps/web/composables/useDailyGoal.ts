import { computed, readonly, type Ref } from 'vue'

const GOAL_ROUNDS = 5

type ProfileApi = {
  activeProfile: Ref<{ id: string; progress?: { bestScore?: number; dailyGoal?: { date: string; roundsPlayed: number } } } | null>
  updateProfile: (id: string, u: Record<string, unknown>) => void
}

function getTodayLocal(): string {
  try {
    const tz = typeof Intl !== 'undefined' && Intl.DateTimeFormat
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC'
    return new Date().toLocaleDateString('en-CA', { timeZone: tz })
  } catch {
    return new Date().toLocaleDateString('en-CA')
  }
}

export function useDailyGoal(profile?: ProfileApi) {
  const today = computed(() => getTodayLocal())

  const dailyGoal = computed(() => {
    const p = profile?.activeProfile.value
    if (!p?.progress?.dailyGoal) return null
    const dg = p.progress.dailyGoal
    return dg.date === today.value ? dg : null
  })

  const roundsPlayed = computed(() => dailyGoal.value?.roundsPlayed ?? 0)
  const goalRounds = GOAL_ROUNDS
  const isGoalReached = computed(() => roundsPlayed.value >= goalRounds)

  function incrementRound(): void {
    if (!profile) return
    const p = profile.activeProfile.value
    if (!p?.id) return
    const current = dailyGoal.value
    const newRounds = (current?.roundsPlayed ?? 0) + 1
    profile.updateProfile(p.id, {
      progress: {
        ...p.progress,
        dailyGoal: { date: today.value, roundsPlayed: newRounds },
      },
    })
  }

  return {
    roundsPlayed: readonly(roundsPlayed),
    goalRounds,
    isGoalReached: readonly(isGoalReached),
    incrementRound,
  }
}
