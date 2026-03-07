---
id: "0125"
title: "epic23-1-benchmark-baseline"
owner: "orchestrator"
status: "pending"
scope_in:
  - "Add benchmark script or CI step that records e2e-container job duration"
  - "Document current baseline (Playwright run time) in docs/runbooks or scripts/ci"
  - "CI job outputs duration (e.g. via job summary or artifact)"
  - "All existing Playwright tests must remain green"
scope_out:
  - "Changing workers or test logic"
  - "Optimizing test speed (Epic 23.2–23.4)"
acceptance:
  - "Benchmark script or step exists and runs in CI"
  - "Baseline documented (current ~2+ min)"
  - "e2e-container job reports duration"
  - "All tests pass"
lanes:
  - name: "I"
    files: [".github/workflows/**", "scripts/ci/**", "docs/runbooks/**"]
gates: ["C", "D", "F"]
risks:
  - area: "infra"
    note: "CI config change; low risk"
---

## Context

Epic 23.1: Add Playwright CI benchmark and document baseline per docs/design/epic-23.md.
