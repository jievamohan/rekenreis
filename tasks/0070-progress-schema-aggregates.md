---
id: "0070"
title: "progress-schema-aggregates"
owner: "orchestrator"
status: "done"
scope_in:
  - "Extend ProfileProgress with optional aggregates: totalRounds, totalCorrect, totalWrong, totalTimeout, modeCounts"
  - "modeCounts: Partial<Record<InteractionModeId, number>>"
  - "Migration: existing profiles get undefined; treat as 0 in consumers"
  - "isValidV1: allow new optional fields; do not require them"
scope_out:
  - "useRoundOutcome, useProgressSummary, UI"
acceptance:
  - "profileSchema supports new progress fields"
  - "Migration preserves existing profiles"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/utils/profileSchema.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 13 Task 1. Add progress aggregates to profile schema for summary (rounds, accuracy, favorite mode).
