import { ref, readonly, watch, isRef, type Ref } from 'vue'
import type { AdditionQuestion, GameMode } from '../types/game'
import type { Level } from '../types/level'
import { generateAdditionQuestion } from '../utils/questionGenerator'
import { generateQuestionFromLevel } from '../utils/levelGenerator'
import { createSeededRng } from '../utils/seedableRng'
import { effectivePacingTag } from '../utils/pacingEngine'

/** Normal feedback: correct/incorrect with selected answer */
export interface PlayFeedbackCorrect {
  correct: boolean
  selectedAnswer: number
}

/** Timeout feedback: reveal answer without score change */
export interface PlayFeedbackTimeout {
  type: 'timeout'
  correctAnswer: number
}

export type PlayFeedback = PlayFeedbackCorrect | PlayFeedbackTimeout

export interface UsePlayGameOptions {
  source?: 'infinite' | 'pack' | Ref<'infinite' | 'pack'>
  levelPack?: Level[] | Ref<Level[]>
  /** Initial index into level pack (e.g. derived from map level). */
  initialPackIndex?: number | Ref<number>
  /** Seed for pack-mode RNG; allows session-level variety. */
  packSeed?: number | Ref<number>
  /** When > 0, prefer next easy level from pack (pack mode only). Ref is decremented when easy level is served. */
  strugglingRoundsLeft?: Ref<number>
}

export function usePlayGame(
  mode: GameMode | Ref<GameMode>,
  options: UsePlayGameOptions = {}
) {
  const sourceRef = isRef(options.source) ? options.source : ref(options.source ?? 'infinite')
  const levelPackRef = isRef(options.levelPack) ? options.levelPack : ref(options.levelPack ?? [])
  const initialPackIndexRef = isRef(options.initialPackIndex) ? options.initialPackIndex : ref(options.initialPackIndex ?? 0)
  const packSeedRef = isRef(options.packSeed) ? options.packSeed : ref(options.packSeed ?? 42)
  const strugglingRef = options.strugglingRoundsLeft ?? ref(0)
  const modeRef = isRef(mode) ? mode : ref(mode)
  const question = ref<AdditionQuestion | null>(null)
  const score = ref(0)
  const streak = ref(0)
  const feedback = ref<PlayFeedback | null>(null)

  // Pack mode: index into level pack; cycle when exhausted.
  const packIndex = ref(Math.max(0, initialPackIndexRef.value))
  let packRng = createSeededRng(packSeedRef.value)

  function loadQuestion() {
    const source = sourceRef.value
    const levelPack = levelPackRef.value
    if (source === 'pack' && levelPack.length > 0) {
      const preferEasy = strugglingRef.value > 0
      let level = levelPack[packIndex.value % levelPack.length]
      if (preferEasy && effectivePacingTag(level) !== 'easy') {
        for (let i = 1; i < levelPack.length; i++) {
          const idx = (packIndex.value + i) % levelPack.length
          const l = levelPack[idx]
          if (effectivePacingTag(l) === 'easy') {
            level = l
            packIndex.value += i
            break
          }
        }
      }
      question.value = generateQuestionFromLevel(level, packRng)
      packIndex.value += 1
      if (preferEasy && effectivePacingTag(level) === 'easy') {
        strugglingRef.value = Math.max(0, strugglingRef.value - 1)
      }
    } else {
      question.value = generateAdditionQuestion(modeRef.value)
    }
    feedback.value = null
  }

  watch([modeRef, sourceRef, levelPackRef, initialPackIndexRef, packSeedRef], () => {
    score.value = 0
    streak.value = 0
    packIndex.value = Math.max(0, initialPackIndexRef.value)
    packRng = createSeededRng(packSeedRef.value)
    loadQuestion()
  }, { deep: true })

  function selectAnswer(choice: number, opts?: { silent?: boolean }) {
    if (!question.value || feedback.value) return
    const correct = choice === question.value.correctAnswer
    if (correct) {
      score.value += 1
      streak.value += 1
    } else {
      streak.value = 0
    }
    if (!opts?.silent) {
      feedback.value = { correct, selectedAnswer: choice }
    }
  }

  function nextQuestion() {
    loadQuestion()
  }

  function recordTimeout() {
    if (!question.value || feedback.value) return
    feedback.value = {
      type: 'timeout',
      correctAnswer: question.value.correctAnswer,
    }
  }

  loadQuestion()

  return {
    question: readonly(question),
    score: readonly(score),
    streak: readonly(streak),
    feedback: readonly(feedback),
    selectAnswer,
    nextQuestion,
    recordTimeout,
  }
}
