---
id: "0126"
title: "epic23-2-workers-project-consolidation"
owner: "orchestrator"
status: "pending"
scope_in:
  - "Increase workers from 1 to 2 or 4 when CI=true"
  - "Restrict visual project to run only e2e/visual/*.spec.ts"
  - "Ensure chromium project runs all functional specs"
  - "Verify no shared state between tests if workers > 1"
scope_out:
  - "pnpm cache (23.3)"
  - "Slow test optimization (23.3)"
  - "Deduplication (23.4)"
acceptance:
  - "workers: 2 or 4 in CI"
  - "visual project runs only visual specs"
  - "Duration reduced by ~40–50%"
  - "All tests green"
lanes:
  - name: "I"
    files: ["apps/web/playwright.config.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "infra"
    note: "Workers > 1 may expose shared-state flakiness"
---

## Context

Epic 23.2: Workers & Project Consolidation per docs/design/epic-23.md.
