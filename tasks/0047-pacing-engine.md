---
id: "0047"
title: "pacing-engine"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create apps/web/utils/pacingEngine.ts"
  - "applyPacing(levels: Level[], seed: number): Level[]"
  - "Invariant: never two consecutive challenge levels"
  - "Deterministic: same seed => same output"
scope_out:
  - "play.vue integration"
acceptance:
  - "applyPacing returns reordered Level[]"
  - "No two consecutive levels with pacingTag 'challenge'"
  - "Same seed produces same sequence"
  - "Unit tests cover invariants and determinism"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/utils/pacingEngine.ts", "apps/web/test/pacingEngine.test.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 8 Task 3. Pacing engine to mix difficulty without clustering hard items.
