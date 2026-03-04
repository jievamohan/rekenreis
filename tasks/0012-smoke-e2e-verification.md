---
id: "0012"
title: "smoke-e2e-verification"
owner: "orchestrator"
status: "done"
scope_in:
  - "Verify /play loads in infinite mode (default)"
  - "Verify /play?mode=pack loads and plays"
  - "Update smoke runbook or tests if behavior changed"
  - "All gates (C, D, F), lint, test pass"
  - "api.test.ts, HealthTest unchanged and green"
scope_out:
  - "New E2E automation (optional future)"
  - "Code changes unless fixing regressions"
acceptance:
  - "docker compose up: /play loads; /play?mode=pack loads"
  - "Questions display; answers work in both modes"
  - "artifacts/tests.md, typecheck.md, perf.md indicate PASS"
  - "docs/runbooks smoke steps updated if needed"
lanes:
  - name: "T"
    files: ["apps/web/test/**", "docs/runbooks/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Final verification for Epic 1. Must not break existing smoke/e2e.

## Dependencies

- Requires tasks 0008-0011 complete.
