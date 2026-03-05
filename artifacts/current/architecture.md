# Architecture: Fix Failing Playwright Tests

## Changes
1. **nuxt.config.ts** — add `app.head.title: 'Rekenreis'` so all pages get a default `<title>`.
2. **e2e snapshot baselines** — generate and commit Linux-rendered baseline PNGs for the visual regression test.

## Impact
- No new dependencies.
- No API changes.
- No database changes.
- No Docker/CI workflow changes.
- Strictly W1 (web pages/components) + T (tests) lanes.
