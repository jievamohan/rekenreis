---
id: "0066"
title: "useDailyGoal-composable"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create useDailyGoal(profile?) composable"
  - "getTodayLocal(): YYYY-MM-DD via toLocaleDateString('en-CA')"
  - "roundsPlayed, goalRounds=5, isGoalReached"
  - "incrementRound(): reset if new day, else +1; persist to profile"
scope_out:
  - "Play integration, sticker book"
acceptance:
  - "incrementRound persists per profile"
  - "New day resets roundsPlayed to 0"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/composables/useDailyGoal.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 12 Task 2. Daily goal composable with timezone-safe reset.
