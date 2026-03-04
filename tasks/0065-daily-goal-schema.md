---
id: "0065"
title: "daily-goal-schema"
owner: "orchestrator"
status: "done"
scope_in:
  - "Extend ProfileData.progress with dailyGoal?: { date: string; roundsPlayed: number }"
  - "date = YYYY-MM-DD (local); roundsPlayed = rounds completed today"
  - "Migration: existing profiles get undefined; init on first daily goal use"
scope_out:
  - "useDailyGoal, UI"
acceptance:
  - "profileSchema supports dailyGoal in progress"
  - "Migration preserves existing profiles"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/utils/profileSchema.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 12 Task 1. Add daily goal storage to profile schema.
