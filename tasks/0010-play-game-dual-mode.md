---
id: "0010"
title: "play-game-dual-mode"
owner: "orchestrator"
status: "done"
scope_in:
  - "Extend usePlayGame to accept source: 'infinite' | 'pack' and optional levelPack"
  - "Infinite mode: use existing generateAdditionQuestion (with seeded RNG for determinism if desired)"
  - "Pack mode: serve questions from provided levelPack (preloaded from levels.v1.json)"
  - "Unit tests: pack mode returns questions from pack; infinite mode unchanged"
scope_out:
  - "Page-level mode switch UI (task 0011)"
  - "Query param parsing (task 0011)"
acceptance:
  - "usePlayGame(mode, { source: 'infinite' }) behaves as today"
  - "usePlayGame(mode, { source: 'pack', levelPack }) serves questions from pack"
  - "Pack exhausted: cycle or end (document behavior)"
  - "Unit tests: both modes covered"
  - "Gate C, D, F pass; existing tests green"
lanes:
  - name: "W2"
    files: ["apps/web/composables/**", "apps/web/utils/**"]
  - name: "T"
    files: ["apps/web/test/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Composable dual-mode support. Depends on 0008, 0009.

## Dependencies

- Requires task 0008 (Level schema), 0009 (generator + content pack).

## Notes

- Pack mode: convert Level to AdditionQuestion when serving (use level's operand ranges, choiceCount).
- Pack exhaustion: cycle from start for infinite play feel, or define end-of-pack behavior.
