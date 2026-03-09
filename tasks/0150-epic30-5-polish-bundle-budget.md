---
id: "0150"
title: "Epic 30.5 — Polish + Bundle Budget"
scope_in:
  - Bundle budget (Gate F) must pass
  - Visual regression baselines: map, level complete, mistakes review
  - Reduced motion: map avatar-bounce off when preferred
  - Final E2E pass: full flow map → play → complete → review → map
scope_out:
  - New features; Epic 30 complete after this
lanes:
  W1: apps/web/components/map/MapAvatar.vue
  T: apps/web/e2e/**/*.spec.ts, apps/web/test/**/*.ts
  I: .github/workflows/gates.yml, apps/web/playwright.config.ts
gates:
  - C
  - D
  - F
risks: []
acceptance:
  - Bundle budget passes
  - Visual baselines committed for map, level complete, mistakes review
  - Reduced motion respected (avatar-bounce off when prefers-reduced-motion)
  - E2E green (full flow)
status: pending
---

# Epic 30.5 — Polish + Bundle Budget

## Acceptance Criteria

1. **Bundle budget (Gate F)**: Verify and fix if needed; budget must pass.
2. **Visual regression**: Capture/update baselines for map, level complete, mistakes review.
3. **Reduced motion**: MapAvatar avatar-bounce only when `prefers-reduced-motion: no-preference`; verify in E2E or unit test.
4. **Final E2E**: Full flow map → play → complete → review → map passes in container.
5. Typecheck, build, smoke green.
