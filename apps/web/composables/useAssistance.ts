import { ref, watch, computed, type Ref } from 'vue'
import type { PlayFeedback } from './usePlayGame'
import type { HintType } from '~/types/skin'

/** Threshold: after this many consecutive wrong answers, show hint */
const HINT_THRESHOLD = 2

/** Threshold: after this many consecutive wrong, trigger pacing intervention */
const STRUGGLING_THRESHOLD = 3

/** Number of easy rounds to serve when struggling */
const STRUGGLING_ROUNDS = 2

/** Correct streak needed to reset struggling state */
const RECOVERY_STREAK = 2

/**
 * Tracks wrong-answer streak and exposes hint state.
 * Deterministic: same feedback sequence => same hintToShow.
 * @param strugglingRoundsLeftRef - Ref to mutate when struggling/recovery; passed to usePlayGame for pack-mode intervention.
 */
export function useAssistance(
  feedback: Ref<PlayFeedback | null | undefined>,
  strugglingRoundsLeftRef: Ref<number>
) {
  const wrongStreak = ref(0)
  const correctStreak = ref(0)

  watch(feedback, (fb) => {
    if (!fb) return
    if ('correct' in fb) {
      if (fb.correct) {
        wrongStreak.value = 0
        correctStreak.value += 1
        if (correctStreak.value >= RECOVERY_STREAK) {
          strugglingRoundsLeftRef.value = 0
        }
      } else {
        wrongStreak.value += 1
        correctStreak.value = 0
        if (wrongStreak.value >= STRUGGLING_THRESHOLD) {
          strugglingRoundsLeftRef.value = STRUGGLING_ROUNDS
        }
      }
    }
  })

  const hintToShow = computed<HintType | null>(() =>
    wrongStreak.value >= HINT_THRESHOLD ? 'dots' : null
  )

  const wrongCount = computed(() => wrongStreak.value)

  return { hintToShow, wrongCount }
}
