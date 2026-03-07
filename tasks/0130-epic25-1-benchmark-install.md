---
id: "0130"
title: "epic25-1-benchmark-install"
scope_in:
  - "scripts/ci/e2e-benchmark.sh"
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
  - "CI output toont duur per substap (install vs test)"
  - "Baseline gedocumenteerd in docs/runbooks/e2e-benchmark.md"
  - "Alle Playwright tests green"
  - "Playwright runs container-only via docker compose e2e"
---

# Epic 25.1 — Benchmark e2e Install Timing

## Goal

Meet en documenteer baseline voor e2e install-stap.

## Implementation

1. In e2e-benchmark.sh: split timing into install substep vs test substep.
   - Install: npm install -g pnpm, pnpm install (when needed)
   - Test: pnpm test:e2e
2. Output both durations to GITHUB_STEP_SUMMARY when in CI.
3. Document baseline in docs/runbooks/e2e-benchmark.md (Epic 25 section).

## Notes

- When node_modules cache hits: install substep is minimal (only npm install -g pnpm).
- When cache misses: full pnpm install runs; both substeps contribute to total.
