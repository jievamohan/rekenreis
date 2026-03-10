import { ref, computed } from 'vue'
import { computeStars } from '~/utils/starScoring'
import { generateTowerLevel } from '~/utils/towerLevelGenerator'
import type { TowerLevelConfig, TowerPuzzle } from '~/types/tower'

export type TowerEnginePhase =
  | 'hint'
  | 'lastChance'
  | 'playing'
  | 'roundComplete'
  | 'levelComplete'

/**
 * Tower level engine: rounds, towers per round, mistake counting.
 * 2 mistakes → hint, 3 → last chance, 4 → round skipped (not correct).
 */
export function useTowerLevelEngine(config: TowerLevelConfig, seed: number) {
  const rounds = generateTowerLevel(seed, config)
  const currentRoundIndex = ref(0)
  const currentTowerIndex = ref(0)
  const mistakeCount = ref(0)
  const correctRounds = ref(0)
  const phase = ref<TowerEnginePhase>('playing')

  const currentRound = computed(() => rounds[currentRoundIndex.value])
  const currentPuzzle = computed(
    (): TowerPuzzle | null =>
      currentRound.value?.[currentTowerIndex.value] ?? null
  )
  const totalRounds = config.rounds
  const towersPerRound = config.towersPerRound

  const starThresholds = config.starThresholds ?? [
    Math.ceil(totalRounds * 0.3),
    Math.ceil(totalRounds * 0.6),
    Math.ceil(totalRounds * 0.9),
  ] as [number, number, number]

  const stars = computed(() =>
    computeStars(correctRounds.value, totalRounds, starThresholds)
  )

  /** 2 mistakes → hint */
  const showHint = computed(() => mistakeCount.value >= 2)

  /** 3 mistakes → last chance */
  const showLastChance = computed(() => mistakeCount.value >= 3)

  /** 4 mistakes → round skipped */
  const shouldSkipRound = computed(() => mistakeCount.value >= 4)

  function recordCorrect() {
    mistakeCount.value = 0
    advanceTower()
  }

  function recordWrong() {
    mistakeCount.value++
    if (mistakeCount.value >= 4) {
      phase.value = 'roundComplete'
      correctRounds.value += 0 // round skipped, not correct
      advanceRound()
    } else if (mistakeCount.value >= 3) {
      phase.value = 'lastChance'
    } else if (mistakeCount.value >= 2) {
      phase.value = 'hint'
    }
  }

  function advanceTower() {
    if (currentTowerIndex.value < towersPerRound - 1) {
      currentTowerIndex.value++
      mistakeCount.value = 0
      phase.value = 'playing'
    } else {
      correctRounds.value++
      phase.value = 'roundComplete'
    }
  }

  function advanceRound() {
    if (currentRoundIndex.value < totalRounds - 1) {
      currentRoundIndex.value++
      currentTowerIndex.value = 0
      mistakeCount.value = 0
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

  /** Reset hint/lastChance phase so player can continue trying */
  function dismissPhase() {
    if (phase.value === 'hint' || phase.value === 'lastChance') {
      phase.value = 'playing'
    }
  }

  return {
    rounds,
    currentRoundIndex,
    currentTowerIndex,
    currentRound,
    currentPuzzle,
    mistakeCount,
    correctRounds,
    phase,
    totalRounds,
    towersPerRound,
    stars,
    showHint,
    showLastChance,
    shouldSkipRound,
    recordCorrect,
    recordWrong,
    advanceTower,
    advanceRound,
    goToNextRound,
    dismissPhase,
  }
}

export type UseTowerLevelEngineReturn = ReturnType<typeof useTowerLevelEngine>
