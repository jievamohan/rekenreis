---
id: "0008"
title: "level-schema-validator"
owner: "orchestrator"
status: "done"
scope_in:
  - "Define Level TypeScript type: operator, operandMin, operandMax, choiceCount, hintMode, difficultyTag, masteryRules (optional)"
  - "Implement runtime validator (Zod or valibot) for Level"
  - "Unit tests: valid Level passes; invalid (missing field, bad ranges, wrong types) fails"
scope_out:
  - "Level generator or content pack"
  - "Composable or page changes"
acceptance:
  - "types/level.ts exports Level type"
  - "levelValidator.ts (or equivalent) validates Level; throws or returns ParseResult for invalid"
  - "Unit tests: valid level passes; invalid levels fail validation"
  - "Gate C, D, F pass; existing tests green"
lanes:
  - name: "W2"
    files: ["apps/web/types/**", "apps/web/utils/**"]
  - name: "T"
    files: ["apps/web/test/**"]
gates: ["C", "D", "F"]
risks:
  - area: "deps"
    note: "May add Zod or valibot; keep bundle impact minimal"
---

## Context

Foundation for Epic 1. Level schema enables data-driven game and content pack validation.

## Constraints

- Operator: "addition" only. operandMin/Max define per-operand bounds.
- choiceCount: number of multiple-choice options (e.g. 3-4).
- hintMode, difficultyTag: string enums or freeform for now.
- masteryRules: optional object; structure TBD, can be `Record<string, unknown>` initially.
