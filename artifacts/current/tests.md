# Tests: Epic 21

## New E2E Tests (all passing)
- `e2e/app-flow.spec.ts` (3 tests):
  - complete level → back to map with progress
  - exit-to-map button navigates back
  - map shows choose level header and play CTA
- `e2e/navigation.spec.ts` (4 tests):
  - map-only elements not on play page
  - play-only elements not on map page
  - map page has choose level header and progress
  - exit to map from play returns to map

## Updated Tests
- `e2e/level-complete.spec.ts`: updated "Next Level" button selector for new modal layout

## Pre-existing CI failures (not caused by this PR)
- `smoke.spec.ts`: homepage title assertion (empty title in CI)
- `visual/play-visual.spec.ts`: missing baseline snapshot

## Container-only
All Playwright tests run via `docker compose run --rm e2e` only.
