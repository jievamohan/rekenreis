import { ref, computed } from 'vue'
import { computeStars } from '~/utils/starScoring'
import { generateTowerLevel } from '~/utils/towerLevelGenerator'
import type { TowerLevelConfig, TowerPuzzle } from '~/types/tower'

export type TowerEnginePhase = 'playing' | 'roundComplete' | 'levelComplete'

/**
 * Tower level engine: one tower per round, one chance per tower.
 * Wrong = immediate skip to next round.
 */
export function useTowerLevelEngine(config: TowerLevelConfig, seed: number) {
  const rounds = generateTowerLevel(seed, config)
  const currentRoundIndex = ref(0)
  const correctRounds = ref(0)
  const phase = ref<TowerEnginePhase>('playing')

  const currentRound = computed(() => rounds[currentRoundIndex.value])
  const currentPuzzle = computed(
    (): TowerPuzzle | null => currentRound.value?.[0] ?? null
  )
  const totalRounds = config.rounds

  const starThresholds = config.starThresholds ?? [
    Math.ceil(totalRounds * 0.3),
    Math.ceil(totalRounds * 0.6),
    Math.ceil(totalRounds * 0.9),
  ] as [number, number, number]

  const stars = computed(() =>
    computeStars(correctRounds.value, totalRounds, starThresholds)
  )

  function recordCorrect() {
    correctRounds.value++
    phase.value = 'roundComplete'
  }

  function recordWrong() {
    phase.value = 'roundComplete'
    // correctRounds unchanged: round skipped
  }

  function advanceRound() {
    if (currentRoundIndex.value < totalRounds - 1) {
      currentRoundIndex.value++
      phase.value = 'playing'
    } else {
      phase.value = 'levelComplete'
    }
  }

  /** Call after round complete (either correct or skipped) to go to next round */
  function goToNextRound() {
    if (phase.value === 'roundComplete') {
      advanceRound()
    }
  }

  return {
    rounds,
    currentRoundIndex,
    currentRound,
    currentPuzzle,
    correctRounds,
    phase,
    totalRounds,
    stars,
    recordCorrect,
    recordWrong,
    advanceRound,
    goToNextRound,
  }
}

export type UseTowerLevelEngineReturn = ReturnType<typeof useTowerLevelEngine>
