# Fix Failing Playwright Tests

## Summary
Fixes 4 failing Playwright tests in CI:
- **smoke.spec.ts "homepage loads"** — adds missing `<title>` tag to the Nuxt app
- **visual/play-visual.spec.ts "keypad mode screenshot"** — generates and commits missing visual regression baseline snapshots

## Changes
1. `apps/web/nuxt.config.ts` — added `app.head.title: 'Rekenreis'`
2. `apps/web/e2e/visual/play-visual.spec.ts-snapshots/` — committed baseline PNGs for chromium and visual projects

## Tasks
- [ ] 0117-fix-playwright-title-and-snapshots

## PR Metadata
- Base: main
- Branch: feat/0117-fix-playwright-tests
- PR: #55
- URL: https://github.com/jievamohan/rekenreis/pull/55
