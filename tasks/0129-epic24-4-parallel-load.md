---
id: "0129"
title: "epic24-4-parallel-load"
scope_in:
  - ".github/workflows/gates.yml"
  - "docs/runbooks/e2e-benchmark.md"
scope_out:
  - "apps/web"
  - "apps/api"
  - "test logic"
lanes: ["I"]
gates: ["C", "D", "F"]
risk_tags: ["infra"]
acceptance:
  - "Playwright + MySQL image loads run in parallel when both caches hit"
  - "docs/runbooks/e2e-benchmark.md updated with final Epic 24 config"
  - "All Playwright tests green"
  - "e2e-container job succeeds on cache hit and cache miss"
---

# Epic 24.4 — Parallel Load + Final Config

## Goal

Reduce spinup time by loading Playwright and MySQL images in parallel when both caches hit. Document final config.

## Implementation

1. In e2e-container job: combine "Load Playwright image" and "Load mysql image" into single step when both caches hit. Run `docker load` for both in parallel (background + wait).
2. Update docs/runbooks/e2e-benchmark.md with final Epic 24.4 config and target status.

## Notes

- When cache miss: existing Pull steps run (sequential is OK for cold start).
- Parallel load only when BOTH caches hit; otherwise keep current flow.
