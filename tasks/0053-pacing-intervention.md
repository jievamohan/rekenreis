---
id: "0053"
title: "pacing-intervention"
owner: "orchestrator"
status: "done"
scope_in:
  - "useAssistance: track wrongStreak (consecutive wrong in session)"
  - "When wrongStreak >= 3: set strugglingRoundsLeft = 2"
  - "play.vue / usePlayGame: when strugglingRoundsLeft > 0 and source=pack, prefer next 'easy' level from pack"
  - "On 2 correct in a row: reset strugglingRoundsLeft, wrongStreak"
  - "Pack mode only; infinite mode unchanged"
scope_out:
  - "Tests"
acceptance:
  - "3 wrong in a row triggers easier-next-2-rounds"
  - "2 correct resets intervention state"
  - "Infinite mode ignores pacing intervention"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/composables/useAssistance.ts", "apps/web/composables/usePlayGame.ts", "apps/web/pages/play.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 9 Task 4. Gentle pacing: auto-switch to easier levels when child struggles.
