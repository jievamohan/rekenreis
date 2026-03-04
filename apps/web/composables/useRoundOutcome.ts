import type { Ref } from 'vue'
import type { InteractionModeId } from '~/types/mode'

export type RoundOutcome = 'correct' | 'wrong' | 'timeout'

type ProgressShape = {
  bestScore?: number
  dailyGoal?: { date: string; roundsPlayed: number }
  totalRounds?: number
  totalCorrect?: number
  totalWrong?: number
  totalTimeout?: number
  modeCounts?: Partial<Record<InteractionModeId, number>>
}

type ProfileApi = {
  activeProfile: Ref<{ id: string; progress?: ProgressShape } | null>
  updateProfile: (id: string, u: Record<string, unknown>) => void
}

export function useRoundOutcome(profile?: ProfileApi) {
  function recordRoundOutcome(outcome: RoundOutcome, mode: InteractionModeId): void {
    if (!profile) return
    const p = profile.activeProfile.value
    if (!p?.id) return

    const prog = p.progress ?? {}
    const totalRounds = (prog.totalRounds ?? 0) + 1
    const totalCorrect = (prog.totalCorrect ?? 0) + (outcome === 'correct' ? 1 : 0)
    const totalWrong = (prog.totalWrong ?? 0) + (outcome === 'wrong' ? 1 : 0)
    const totalTimeout = (prog.totalTimeout ?? 0) + (outcome === 'timeout' ? 1 : 0)
    const counts = prog.modeCounts ?? {}
    const modeCounts = { ...counts, [mode]: (counts[mode] ?? 0) + 1 }

    profile.updateProfile(p.id, {
      progress: {
        ...prog,
        totalRounds,
        totalCorrect,
        totalWrong,
        totalTimeout,
        modeCounts,
      },
    })
  }

  return { recordRoundOutcome }
}
