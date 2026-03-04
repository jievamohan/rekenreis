---
id: "0096"
title: "graphics-tests-smoke"
owner: "orchestrator"
status: "done"
scope_in:
  - "Unit tests: ModeBuildBridge mode contract, drag/drop state transitions"
  - "Unit tests: wrong drop returns plank, no onNext; correct calls onNext"
  - "Unit tests: hint after 2 wrong (fake timers/state)"
  - "Update docs/runbooks smoke: build-bridge graphical scene verification"
  - "CI green; existing modes unchanged"
scope_out:
  - "Playwright/Cypress e2e (manual smoke sufficient)"
acceptance:
  - "Unit tests pass for mode contract and drag/drop logic"
  - "Smoke runbook includes: switch to build-bridge, complete one round"
  - "Classic and timed-pop smoke still pass"
  - "CI green"
lanes:
  - name: "T"
    files: ["apps/web/test/**", "apps/web/components/modes/ModeBuildBridge.vue"]
  - name: "I"
    files: ["docs/runbooks/*.md"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Tests use fake timers; no heavy deps"
---

## Context

Epic 17 Task 5. Tests and smoke verification.
