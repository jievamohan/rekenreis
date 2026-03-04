---
id: "0024"
title: "persistence-tests"
owner: "orchestrator"
status: "done"
scope_in:
  - "Unit tests: schema migration v0->v1"
  - "Unit tests: schema validation"
  - "API test: session-stats endpoint"
scope_out:
  - "Full e2e"
acceptance:
  - "Migration tests pass"
  - "API test passes"
  - "All gates PASS"
lanes:
  - name: "T"
    files: ["apps/web/**/*.test.ts", "apps/api/tests/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 4: Tests for persistence and API.
