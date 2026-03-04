---
id: "0004"
title: "game-types-generator"
owner: "orchestrator"
status: "ready"
scope_in:
  - "Define AdditionQuestion and GameMode types for extensibility"
  - "Implement pure generateAdditionQuestion(mode) with 3-4 unique choices"
  - "Unit tests: sum bounds (≤10, ≤20), choice uniqueness, correct answer in choices"
scope_out:
  - "Composable, page, or UI"
  - "Other operations (subtraction, etc.)"
acceptance:
  - "types/game.ts (or equivalent) exports AdditionQuestion, GameMode"
  - "generateAdditionQuestion('upTo10') returns a+b≤10, 3-4 unique choices"
  - "generateAdditionQuestion('upTo20') returns a+b≤20"
  - "Unit tests pass: correctness, uniqueness"
  - "Gate C, D, F pass; api.test.ts and HealthTest unchanged and green"
lanes:
  - name: "W2"
    files: ["apps/web/utils/**", "apps/web/types/**", "apps/web/services/**"]
  - name: "T"
    files: ["apps/web/test/**", "apps/web/**/__tests__/**"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Generator is sync; negligible"
---

## Context

Foundation for Epic 0: Game Core MVP. Pure question generator enables deterministic testing and future skins/levels.

## Constraints

- No new npm deps unless strictly required.
- Types must allow future extension (levels, skins).
