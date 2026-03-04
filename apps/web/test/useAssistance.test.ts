import { describe, it, expect, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useAssistance } from '../composables/useAssistance'
import type { PlayFeedback } from '~/composables/usePlayGame'

function createFeedback(correct: boolean, selectedAnswer = 0): PlayFeedback {
  return { correct, selectedAnswer }
}

describe('useAssistance', () => {
  let feedback: ReturnType<typeof ref<PlayFeedback | null>>
  const strugglingRoundsLeft = ref(0)

  beforeEach(() => {
    feedback = ref<PlayFeedback | null>(null)
    strugglingRoundsLeft.value = 0
  })

  it('returns hintToShow null initially', () => {
    const { hintToShow } = useAssistance(feedback, strugglingRoundsLeft)
    expect(hintToShow.value).toBeNull()
  })

  it('keeps hintToShow null after one wrong answer', async () => {
    const { hintToShow } = useAssistance(feedback, strugglingRoundsLeft)
    feedback.value = createFeedback(false, 4)
    await nextTick()
    expect(hintToShow.value).toBeNull()
  })

  it('sets hintToShow to dots after 2 consecutive wrong answers', async () => {
    const { hintToShow } = useAssistance(feedback, strugglingRoundsLeft)
    feedback.value = createFeedback(false, 4)
    await nextTick()
    expect(hintToShow.value).toBeNull()

    // Simulate next question, then wrong again
    feedback.value = null
    await nextTick()
    feedback.value = createFeedback(false, 3)
    await nextTick()
    expect(hintToShow.value).toBe('dots')
  })

  it('resets wrongCount after correct answer', async () => {
    const { hintToShow, wrongCount } = useAssistance(feedback, strugglingRoundsLeft)
    feedback.value = createFeedback(false, 4)
    await nextTick()
    expect(wrongCount.value).toBe(1)

    feedback.value = null
    await nextTick()
    feedback.value = createFeedback(true, 5)
    await nextTick()
    expect(wrongCount.value).toBe(0)
    expect(hintToShow.value).toBeNull()
  })

  it('wrongCount increments deterministically', async () => {
    const { wrongCount } = useAssistance(feedback, strugglingRoundsLeft)
    feedback.value = createFeedback(false, 1)
    await nextTick()
    expect(wrongCount.value).toBe(1)
    feedback.value = createFeedback(false, 2)
    await nextTick()
    expect(wrongCount.value).toBe(2)
  })

  it('sets strugglingRoundsLeft after 3 consecutive wrong', async () => {
    useAssistance(feedback, strugglingRoundsLeft)
    expect(strugglingRoundsLeft.value).toBe(0)
    feedback.value = createFeedback(false, 1)
    await nextTick()
    feedback.value = createFeedback(false, 2)
    await nextTick()
    feedback.value = createFeedback(false, 3)
    await nextTick()
    expect(strugglingRoundsLeft.value).toBe(2)
  })

  it('resets strugglingRoundsLeft after 2 correct in a row', async () => {
    useAssistance(feedback, strugglingRoundsLeft)
    feedback.value = createFeedback(false, 1)
    await nextTick()
    feedback.value = createFeedback(false, 2)
    await nextTick()
    feedback.value = createFeedback(false, 3)
    await nextTick()
    expect(strugglingRoundsLeft.value).toBe(2)
    feedback.value = createFeedback(true, 5)
    await nextTick()
    feedback.value = createFeedback(true, 6)
    await nextTick()
    expect(strugglingRoundsLeft.value).toBe(0)
  })
})
