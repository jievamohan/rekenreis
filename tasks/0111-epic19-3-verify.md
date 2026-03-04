---
id: "0111"
title: "Verify typecheck + build + bundle budget"
lane: [T, I]
gates: [C, D, F]
scope_in:
  - "apps/web/**"
scope_out:
  - "apps/api/**"
risk_tags: [perf]
depends_on: ["0109", "0110"]
---

# Task 0111 — Verify typecheck + build + bundle budget

## Goal

Run full quality gates to ensure Epic 19.3 changes pass typecheck, build, and bundle budget.

## Acceptance Criteria

- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run build` succeeds
- [ ] Bundle size within budget (.output < 3MB, client JS < 250KB)
- [ ] Total new SVG assets < 50KB
- [ ] No security issues in SVGs (no scripts, no external refs)
