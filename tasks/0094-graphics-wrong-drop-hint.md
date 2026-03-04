---
id: "0094"
title: "graphics-wrong-drop-hint"
owner: "orchestrator"
status: "done"
scope_in:
  - "Wrong drop: gentle wobble on drop zone or plank"
  - "Plank returns to pool (do not advance to next question)"
  - "After 2 wrong: show hint (useAssistance hintToShow)"
  - "Integrate hint display in ModeBuildBridge"
scope_out:
  - "Reduced motion (task 0095)"
  - "New hint types"
acceptance:
  - "Wrong plank dropped → wobble animation, plank returns, user can retry"
  - "After 2 wrong answers: hint (dots/number-line) appears"
  - "Correct answer → celebrate, Next, new question"
  - "No fail state; infinite retries"
lanes:
  - name: "W1"
    files: ["apps/web/components/modes/ModeBuildBridge.vue"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Animation via CSS only"
---

## Context

Epic 17 Task 3. Wrong-drop feedback and hint integration.
