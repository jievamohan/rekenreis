---
id: "0071"
title: "useRoundOutcome-composable"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create useRoundOutcome(profile?) composable"
  - "recordRoundOutcome(outcome: 'correct'|'wrong'|'timeout', mode: InteractionModeId)"
  - "Increment totalRounds, totalCorrect/totalWrong/totalTimeout, modeCounts[mode]"
  - "Handle undefined profile; init aggregates to 0 when missing"
scope_out:
  - "Play integration (0073), useProgressSummary"
acceptance:
  - "recordRoundOutcome persists aggregates per profile"
  - "Handles undefined profile gracefully"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/composables/useRoundOutcome.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 13 Task 2. Composable to record per-round outcome and mode for accuracy and favorite-mode tracking.
