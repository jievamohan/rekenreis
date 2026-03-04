# Task 0004: game-types-generator — PR

## Summary

Add types and question generator for Epic 0 Game Core MVP.

## Acceptance criteria

- [x] types/game.ts exports AdditionQuestion, GameMode
- [x] generateAdditionQuestion('upTo10') returns a+b≤10, 3-4 unique choices
- [x] generateAdditionQuestion('upTo20') returns a+b≤20
- [x] Unit tests pass: correctness, uniqueness
- [x] Gate C, D, F pass; api.test.ts and HealthTest green

## Commands run

- `pnpm run typecheck` — PASS
- `pnpm run test` — PASS (11 tests)
- `pnpm run lint` — PASS
- `pnpm run build` — PASS

## Risks

- perf: negligible (sync generator)

## Rollback

Revert commit; no migrations or API changes.
