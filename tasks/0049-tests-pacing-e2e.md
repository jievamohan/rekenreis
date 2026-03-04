---
id: "0049"
title: "tests-pacing-e2e"
owner: "orchestrator"
status: "done"
scope_in:
  - "E2E: smoke pack mode for classic, timed-pop, build-bridge"
  - "Pack schema validation test (each JSON validates)"
scope_out:
  - "Manual QA"
acceptance:
  - "E2E covers switching to each mode and completing one round with pack"
  - "Pack validation test passes for all three JSON files"
  - "No regressions to existing smoke"
lanes:
  - name: "T"
    files: ["apps/web/test/*.ts", "apps/web/e2e/*.ts", "playwright.config.*"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 8 Task 5. Tests and E2E for content packs and pacing.
