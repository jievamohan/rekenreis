---
id: "0044"
title: "smoke-build-bridge"
owner: "orchestrator"
status: "done"
scope_in:
  - "Extend smoke/e2e: switch to build-bridge mode, complete one round"
  - "Verify mode selector flow and build-bridge round completion"
  - "Keep existing classic/timed-pop smoke green"
scope_out:
  - "Unit tests (separate task)"
acceptance:
  - "Smoke: visit /play, open mode selector, select build-bridge"
  - "Smoke: complete one round (place correct answer), score increments"
  - "Existing smoke passes"
  - "CI green"
lanes:
  - name: "I"
    files: ["tests/**", "playwright.config.*", "docs/runbooks/*"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "E2E may need slight timeout tuning for drag"
---

## Context

E2E smoke ensures build-bridge mode is playable end-to-end.
