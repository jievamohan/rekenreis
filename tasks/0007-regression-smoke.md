---
id: "0007"
title: "regression-smoke"
owner: "orchestrator"
status: "done"
scope_in:
  - "Verify vertical slice intact: /start renders API health"
  - "Verify /play smoke: load, play a few questions"
  - "All gates (C, D, F), lint-test pass"
  - "Document smoke steps in runbook if missing"
scope_out:
  - "New E2E automation (optional future)"
  - "Code changes unless fixing regressions"
acceptance:
  - "api.test.ts, HealthTest pass"
  - "docker compose up: /start shows status ok"
  - "docker compose up: /play loads, questions display, answers work"
  - "artifacts/tests.md, perf.md, typecheck.md indicate PASS"
lanes:
  - name: "T"
    files: ["apps/web/test/**", "docs/runbooks/**"]
  - name: "I"
    files: ["docs/runbooks/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Final verification that Epic 0 does not break existing vertical slice. Typically no code changes unless regression found.
