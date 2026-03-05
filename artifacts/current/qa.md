# QA: Fix Failing Playwright Tests

## Acceptance Criteria
1. `smoke.spec.ts` — "homepage loads" passes in both chromium and visual projects.
2. `visual/play-visual.spec.ts` — "keypad mode screenshot" passes in both chromium and visual projects.
3. All 32 Playwright tests pass (28 already passing + 4 fixed).
4. No regressions in other CI gates (typecheck, build, security).

## Test Plan
- Run full Playwright suite via `docker compose run --rm e2e` locally before push.
- CI will re-run all gates on the PR.
