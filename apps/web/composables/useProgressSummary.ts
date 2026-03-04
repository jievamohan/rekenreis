import { computed, readonly, type Ref } from 'vue'
import type { InteractionModeId } from '~/types/mode'

type ProfileApi = {
  activeProfile: Ref<{
    id: string
    name?: string
    progress?: {
      totalRounds?: number
      totalCorrect?: number
      totalWrong?: number
      totalTimeout?: number
      modeCounts?: Partial<Record<InteractionModeId, number>>
      dailyGoal?: { date: string; roundsPlayed: number }
    }
    prefs?: { lastMode: InteractionModeId }
  } | null>
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

export interface ProgressSummaryExport {
  roundsToday: number
  roundsTotal: number
  accuracy: number
  favoriteMode: string
  exportedAt: string
}

export function useProgressSummary(profile?: ProfileApi) {
  const roundsToday = computed(() => {
    const p = profile?.activeProfile.value
    if (!p?.progress?.dailyGoal) return 0
    const dg = p.progress.dailyGoal
    return dg.date === getTodayLocal() ? dg.roundsPlayed : 0
  })

  const roundsTotal = computed(() => profile?.activeProfile.value?.progress?.totalRounds ?? 0)

  const accuracy = computed(() => {
    const p = profile?.activeProfile.value?.progress
    if (!p) return 0
    const correct = p.totalCorrect ?? 0
    const wrong = p.totalWrong ?? 0
    const answered = correct + wrong
    if (answered === 0) return 0
    return Math.round((correct / answered) * 100)
  })

  const favoriteMode = computed((): string => {
    const p = profile?.activeProfile.value
    if (!p) return 'classic'
    const counts = p.progress?.modeCounts
    if (!counts || Object.keys(counts).length === 0) {
      return p.prefs?.lastMode ?? 'classic'
    }
    let best: InteractionModeId = 'classic'
    let bestCount = 0
    for (const [mode, n] of Object.entries(counts)) {
      if (typeof n === 'number' && n > bestCount) {
        bestCount = n
        best = mode as InteractionModeId
      }
    }
    return best
  })

  function buildExportPayload(): ProgressSummaryExport {
    return {
      roundsToday: roundsToday.value,
      roundsTotal: roundsTotal.value,
      accuracy: accuracy.value,
      favoriteMode: favoriteMode.value,
      exportedAt: new Date().toISOString(),
    }
  }

  async function copyToClipboard(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return false
    const payload = buildExportPayload()
    const json = JSON.stringify(payload, null, 2)
    await navigator.clipboard.writeText(json)
    return true
  }

  function downloadJson(): void {
    const payload = buildExportPayload()
    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const date = new Date().toISOString().slice(0, 10)
    const filename = `rekenreis-progress-${date}.json`
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    roundsToday: readonly(roundsToday),
    roundsTotal: readonly(roundsTotal),
    accuracy: readonly(accuracy),
    favoriteMode: readonly(favoriteMode),
    copyToClipboard,
    downloadJson,
    buildExportPayload,
  }
}
