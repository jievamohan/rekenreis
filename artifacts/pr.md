# Epic 0: Game Core MVP — PR

## Summary

Playable `/play` route for kids math game (age ~6): addition-only core loop, up to 10/20 modes, 3-4 multiple choice answers, immediate feedback, score/streak, keyboard a11y.

## Tasks completed

1. **0004** Types + question generator
2. **0005** usePlayGame composable
3. **0006** /play page with minimal UI
4. **0007** Regression + smoke verification

## Acceptance criteria

- [x] /play renders and is playable
- [x] Question generator: upTo10, upTo20 modes; 3-4 unique choices
- [x] Immediate feedback, score, streak
- [x] Keyboard navigation (Tab, Enter/Space)
- [x] Unit tests: generator correctness, choice uniqueness, composable logic
- [x] Vertical slice (/start, api.test.ts, HealthTest) unchanged

## Commands run

- `pnpm run typecheck` — PASS
- `pnpm run test` — PASS (17 tests)
- `pnpm run lint` — PASS
- `pnpm run build` — PASS

## Risks

- perf: negligible (client-only, sync generator)

## Rollback

Revert commits; no migrations or API changes.

## PR Metadata
- Base: main
- Branch: feat/epic0-game-core-mvp
- PR: #9
- URL: https://github.com/jievamohan/rekenreis/pull/9
