# Epic 0: Game Core MVP — QA Strategy

## Test pyramid

| Level | Coverage | Tools |
|-------|----------|-------|
| Unit | Generator correctness, choice uniqueness, composable logic | Vitest |
| Component | Page render, basic interaction (optional) | Vitest + @vue/test-utils if needed |
| Smoke | Docker compose, /start, /play load | Manual or E2E (future) |

## Per-task test requirements

| Task | Unit | Regression |
|------|------|------------|
| Types + Generator | Generator: sum bounds, uniqueness, correct in choices | — |
| Composable | Score, streak, state transitions | — |
| Page + UI | Optional: render, keyboard | — |
| Integration | — | api.test.ts, HealthTest, smoke pass |

## Mocking/stubbing strategy

- Generator: none—pure function.
- Composable: none for MVP.
- No API mocks for game logic.

## Deterministic data / seed strategy

- Generator can accept optional seed for reproducibility in tests.
- For MVP: deterministic by mode; no flaky RNG if we use fixed seed in tests.

## Regression risks + smoke coverage

- **Risk**: Breaking `/start` or api.test.ts.
- **Mitigation**: No edits to start.vue, api.ts, useApi; run full test suite.
- **Smoke**: `docker compose up`, visit /start and /play, verify both render.

## Definition of Done

- All new unit tests pass.
- api.test.ts and HealthTest pass.
- Gate C (typecheck), D (security), F (build) pass.
- Lint-test job green.
- /play is playable with keyboard.
