---
id: "0117"
title: "Fix Playwright: add page title + generate visual snapshots"
status: "done"
lanes: [W1, T]
scope_in:
  - apps/web/nuxt.config.ts (add app.head.title)
  - apps/web/e2e/visual/play-visual.spec.ts-snapshots/ (generate baseline PNGs)
scope_out:
  - Game logic
  - API changes
  - CI workflow changes
  - New tests
gates: [C, F]
risks: []
acceptance:
  - smoke.spec.ts "homepage loads" passes in chromium and visual projects
  - play-visual.spec.ts "keypad mode screenshot" passes in chromium and visual projects
  - All 32 Playwright tests pass (0 failures)
  - Typecheck passes
  - Build passes
---

# Fix Playwright: add page title + generate visual snapshots

## Problem
CI Playwright job fails with 4 test failures:
1. `smoke.spec.ts:4` "homepage loads" — `toHaveTitle(/rekenreis/i)` gets empty string (×2 projects)
2. `visual/play-visual.spec.ts:4` "keypad mode screenshot" — baseline snapshots missing (×2 projects)

## Implementation

### Step 1: Add page title
In `apps/web/nuxt.config.ts`, add `app.head.title: 'Rekenreis'` to set a default HTML `<title>`.

### Step 2: Generate visual regression baselines
Run Playwright with `--update-snapshots` inside the e2e Docker container to generate:
- `e2e/visual/play-visual.spec.ts-snapshots/play-keypad-chromium-linux.png`
- `e2e/visual/play-visual.spec.ts-snapshots/play-keypad-visual-linux.png`

Commit the generated PNGs.

## Verification
- Run full Playwright suite in container: all 32 tests pass.
- Run typecheck: clean.
- Run build: succeeds.
