---
id: "0050"
title: "assistance-state"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create apps/web/composables/useAssistance.ts"
  - "Track wrongCount per question; reset on nextQuestion"
  - "Expose hintToShow: 'dots' | 'number-line' | null when wrongCount >= 2"
  - "Accept feedback (PlayFeedback), question (AdditionQuestion) as inputs"
  - "Deterministic: no randomness in trigger"
scope_out:
  - "Hint components, play integration, pacing intervention"
acceptance:
  - "useAssistance returns { hintToShow, wrongCount }"
  - "hintToShow is null until wrongCount >= 2"
  - "wrongCount increments on incorrect feedback, resets on next"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/composables/useAssistance.ts", "apps/web/test/useAssistance.test.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 9 Task 1. Confidence gate: after 2 wrong answers, expose hint type for UI to show.
