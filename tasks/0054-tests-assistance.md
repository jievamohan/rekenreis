---
id: "0054"
title: "tests-assistance"
owner: "orchestrator"
status: "done"
scope_in:
  - "Unit: useAssistance wrongCount, hintToShow, reset behavior"
  - "Unit: pacing intervention triggers and resets"
  - "E2E: smoke — play 2 wrong, see hint, next, verify no infinite loop"
  - "Hint component render tests (optional)"
scope_out:
  - "Manual QA"
acceptance:
  - "All unit tests pass"
  - "E2E smoke passes for assistance flow"
  - "No regressions to existing tests"
lanes:
  - name: "T"
    files: ["apps/web/test/useAssistance.test.ts", "apps/web/test/*.ts", "apps/web/e2e/*.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 9 Task 5. Tests for assistance logic and E2E smoke.
