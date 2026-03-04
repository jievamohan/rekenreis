import type { PlayFeedback, PlayFeedbackCorrect, PlayFeedbackTimeout } from '~/composables/usePlayGame'

export function isCorrectFeedback(fb: PlayFeedback | null): fb is PlayFeedbackCorrect {
  return fb !== null && 'correct' in fb
}

export function isTimeoutFeedback(fb: PlayFeedback | null): fb is PlayFeedbackTimeout {
  return fb !== null && 'type' in fb && fb.type === 'timeout'
}
