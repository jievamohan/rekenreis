---
id: "0009"
title: "level-generator-content-pack"
owner: "orchestrator"
status: "done"
scope_in:
  - "Deterministic level generator: generateLevelPack(seed, config) produces Level[]"
  - "Same seed + config -> identical output (unit test)"
  - "Sanity tests: operands in range, correct answer in choices, choices unique"
  - "Create apps/web/content/levels.v1.json (~50 levels) from generator"
scope_out:
  - "Composable or page integration"
  - "Other operators"
acceptance:
  - "levelGenerator.ts exports generateLevelPack(seed, config)"
  - "Same seed produces same level pack (determinism test)"
  - "Generated levels: operandMin <= a,b <= operandMax; correct answer in choices; choices unique"
  - "apps/web/content/levels.v1.json exists with ~50 valid levels"
  - "Gate C, D, F pass; existing tests green"
lanes:
  - name: "W2"
    files: ["apps/web/utils/**", "apps/web/content/**"]
  - name: "T"
    files: ["apps/web/test/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Generates content pack for Epic 1. Depends on task 0008 (Level type + validator).

## Dependencies

- Requires task 0008 (Level schema) complete.

## Notes

- Use seedable RNG (e.g. simple mulberry32 or similar) for determinism.
- Config may specify count, default operand ranges, etc.
- Run generator script or inline to produce levels.v1.json; commit the JSON file.
