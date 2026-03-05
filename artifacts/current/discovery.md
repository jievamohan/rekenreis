# Discovery: Fix Failing Playwright Tests

## Problem Statement
The Playwright job in CI (GitHub Actions) is failing with 4 test failures (28 passed, 4 failed).

## Root Causes Identified

### 1. Missing page title (`smoke.spec.ts:4` — "homepage loads")
- Test expects `page.toHaveTitle(/rekenreis/i)` but receives `""`.
- The Nuxt app has no `<title>` configured — neither `app.head` in `nuxt.config.ts` nor `useHead()` in `app.vue` or `pages/index.vue`.
- Fails in both `chromium` and `visual` projects (2 failures).

### 2. Missing visual regression snapshots (`visual/play-visual.spec.ts:4`)
- Test calls `page.toHaveScreenshot('play-keypad.png')` but no baseline snapshot PNGs exist in the repo.
- Playwright writes the actual image but fails because there's nothing to compare against.
- Missing files:
  - `e2e/visual/play-visual.spec.ts-snapshots/play-keypad-chromium-linux.png`
  - `e2e/visual/play-visual.spec.ts-snapshots/play-keypad-visual-linux.png`
- Fails in both `chromium` and `visual` projects (2 failures).

## Scope
- Fix 1 is a one-line config change in `nuxt.config.ts` (add `app.head.title`).
- Fix 2 requires generating baseline snapshots inside the e2e container (Linux) and committing them.

## Constraints
- Snapshots must be generated in the same environment as CI (Linux, Playwright 1.49.0 Docker image).
- Per repo rules, Playwright must run via `docker compose run --rm e2e`.
