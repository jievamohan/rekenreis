# Review: Fix Failing Playwright Tests

## Status: PASS

### Changes Summary
1. **`apps/web/nuxt.config.ts`** — Added `app.head.title: 'Rekenreis'` to set a default page title.
   This fixes `smoke.spec.ts` "homepage loads" which expects `toHaveTitle(/rekenreis/i)`.

2. **`apps/web/e2e/visual/play-visual.spec.ts-snapshots/`** — Generated baseline PNG snapshots
   for the `play-keypad` visual regression test (chromium + visual projects).
   Generated inside the CI-matching Docker image (`mcr.microsoft.com/playwright:v1.49.0-jammy`).

### Risk Assessment
- LOW risk — no logic changes, no dependency changes
- Title tag is a standard HTML element
- Snapshots are test-only fixtures

### Acceptance Criteria Mapping
| Criterion | Status |
|-----------|--------|
| smoke.spec.ts "homepage loads" passes (chromium + visual) | PASS |
| play-visual.spec.ts "keypad mode screenshot" passes (chromium + visual) | PASS |
| All 32 Playwright tests pass | PASS (32/32) |
| Build succeeds | PASS |
