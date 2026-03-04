import { ref, readonly, watch, isRef, type Ref } from 'vue'
import type { AdditionQuestion, GameMode } from '../types/game'
import { generateAdditionQuestion } from '../utils/questionGenerator'

export interface PlayFeedback {
  correct: boolean
  selectedAnswer: number
}

export function usePlayGame(mode: GameMode | Ref<GameMode>) {
  const modeRef = isRef(mode) ? mode : ref(mode)
  const question = ref<AdditionQuestion | null>(null)
  const score = ref(0)
  const streak = ref(0)
  const feedback = ref<PlayFeedback | null>(null)

  function loadQuestion() {
    question.value = generateAdditionQuestion(modeRef.value)
    feedback.value = null
  }

  watch(modeRef, () => {
    score.value = 0
    streak.value = 0
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
