---
id: "0127"
title: "epic23-3-pnpm-cache-slow-tests"
owner: "orchestrator"
status: "pending"
scope_in:
  - "Improve pnpm install caching in e2e container"
  - "Optimize mistakes-review.spec.ts: reduce timeouts, faster assertions"
scope_out:
  - "Deduplication (23.4)"
  - "Fine-tuning to <60s (23.4)"
acceptance:
  - "pnpm install time reduced in e2e run"
  - "mistakes-review.spec.ts no longer slowest file"
  - "Additional 15–25s saved vs 23.2"
  - "All tests green"
lanes:
  - name: "I"
    files: [".github/workflows/**", "scripts/ci/**"]
  - name: "T"
    files: ["apps/web/e2e/**"]
gates: ["C", "D", "F"]
risks:
  - area: "infra"
    note: "node_modules cache must be invalidated on lockfile change"
---

## Context

Epic 23.3: pnpm Cache & Slow Test Optimization per docs/design/epic-23.md.
