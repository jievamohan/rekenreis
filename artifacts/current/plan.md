# Plan: Fix Failing Playwright Tests

## Branch
- Feature branch: `feat/0117-fix-playwright-tests`

## Task Summary
| Task | Acceptance | Status |
|------|-----------|--------|
| 0117 | All 32 Playwright tests pass, typecheck clean, build succeeds | pending |

## Wave Plan
- Wave 0: n/a (no shared contracts)
- Wave 1: n/a (no backend)
- Wave 2: W1 — add title to nuxt.config.ts
- Wave 3: T — generate visual snapshots, verify all tests pass

## Lane Assignments
- W1: `apps/web/nuxt.config.ts`
- T: `apps/web/e2e/visual/play-visual.spec.ts-snapshots/**`
