import { ref, readonly, watch, isRef, type Ref } from 'vue'
import type { AdditionQuestion, GameMode } from '../types/game'
import type { Level } from '../types/level'
import { generateAdditionQuestion } from '../utils/questionGenerator'
import { generateQuestionFromLevel } from '../utils/levelGenerator'
import { createSeededRng } from '../utils/seedableRng'

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
}

export function usePlayGame(
  mode: GameMode | Ref<GameMode>,
  options: UsePlayGameOptions = {}
) {
  const sourceRef = isRef(options.source) ? options.source : ref(options.source ?? 'infinite')
  const levelPackRef = isRef(options.levelPack) ? options.levelPack : ref(options.levelPack ?? [])
  const modeRef = isRef(mode) ? mode : ref(mode)
  const question = ref<AdditionQuestion | null>(null)
  const score = ref(0)
  const streak = ref(0)
  const feedback = ref<PlayFeedback | null>(null)

  // Pack mode: index into level pack; cycle when exhausted.
  // Fixed seed for reproducibility (same level+index -> same question).
  const packIndex = ref(0)
  const packRng = createSeededRng(42)

  function loadQuestion() {
    const source = sourceRef.value
    const levelPack = levelPackRef.value
    if (source === 'pack' && levelPack.length > 0) {
      const level = levelPack[packIndex.value % levelPack.length]
      question.value = generateQuestionFromLevel(level, packRng)
      packIndex.value += 1
    } else {
      question.value = generateAdditionQuestion(modeRef.value)
    }
    feedback.value = null
  }

  watch([modeRef, sourceRef, levelPackRef], () => {
    score.value = 0
    streak.value = 0
    packIndex.value = 0
    loadQuestion()
  }, { deep: true })

  function selectAnswer(choice: number) {
    if (!question.value || feedback.value) return
    const correct = choice === question.value.correctAnswer
    if (correct) {
      score.value += 1
      streak.value += 1
    } else {
      streak.value = 0
    }
    feedback.value = { correct, selectedAnswer: choice }
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
