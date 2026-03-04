import { ref, readonly, watch, isRef, type Ref } from 'vue'
import type { AdditionQuestion, GameMode } from '../types/game'
import type { Level } from '../types/level'
import { generateAdditionQuestion } from '../utils/questionGenerator'
import { generateQuestionFromLevel } from '../utils/levelGenerator'
import { createSeededRng } from '../utils/seedableRng'

export interface PlayFeedback {
  correct: boolean
  selectedAnswer: number
}

export interface UsePlayGameOptions {
  source?: 'infinite' | 'pack'
  levelPack?: Level[]
}

export function usePlayGame(
  mode: GameMode | Ref<GameMode>,
  options: UsePlayGameOptions = {}
) {
  const { source = 'infinite', levelPack = [] } = options
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
    if (source === 'pack' && levelPack.length > 0) {
      const level = levelPack[packIndex.value % levelPack.length]
      question.value = generateQuestionFromLevel(level, packRng)
      packIndex.value += 1
    } else {
      question.value = generateAdditionQuestion(modeRef.value)
    }
    feedback.value = null
  }

  watch(modeRef, () => {
    score.value = 0
    streak.value = 0
    packIndex.value = 0
    loadQuestion()
  })

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

  loadQuestion()

  return {
    question: readonly(question),
    score: readonly(score),
    streak: readonly(streak),
    feedback: readonly(feedback),
    selectAnswer,
    nextQuestion,
  }
}
