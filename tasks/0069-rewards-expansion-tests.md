---
id: "0069"
title: "rewards-expansion-tests"
owner: "orchestrator"
status: "done"
scope_in:
  - "Unit tests for useDailyGoal: reset on new day, increment, goal reached"
  - "Unit tests for daily goal persistence"
  - "Tests for sticker book / rewards logic"
scope_out:
  - "E2E"
acceptance:
  - "useDailyGoal tests pass"
  - "Typecheck passes"
lanes:
  - name: "T"
    files: ["apps/web/test/useDailyGoal.test.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 12 Task 5. Tests for daily goal and rewards expansion.
