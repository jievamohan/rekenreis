# Task 0004: game-types-generator — Plan

## Task summary

Define `AdditionQuestion` and `GameMode` types; implement pure `generateAdditionQuestion(mode)` with 3–4 unique choices; unit tests for sum bounds, choice uniqueness, correct answer in choices.

## Acceptance criteria mapping

| AC | Implementation |
|----|-----------------|
| types/game.ts exports AdditionQuestion, GameMode | `apps/web/types/game.ts` |
| generateAdditionQuestion('upTo10') returns a+b≤10, 3-4 unique choices | `apps/web/utils/questionGenerator.ts` |
| generateAdditionQuestion('upTo20') returns a+b≤20 | Same |
| Unit tests pass | `apps/web/test/questionGenerator.test.ts` |
| Gates C, D, F; existing tests green | CI |

## Wave plan

- **Wave 0**: Types (`types/game.ts`)
- **Wave 1**: Generator (`utils/questionGenerator.ts`)
- **Wave 2**: Unit tests
- **Wave 3**: Verify gates

## Lane assignments

- W2: types, utils
- T: test file

## Branch

`feat/epic0-game-core-mvp`
