# Epic 0: Game Core MVP — Architecture

## Proposed module boundaries

| Lane | Scope | Files |
|------|-------|-------|
| W1 | Pages, components | `apps/web/pages/**`, `apps/web/components/**` |
| W2 | Composables, services, types | `apps/web/composables/**`, `apps/web/utils/**`, `apps/web/types/**` |
| T | Tests | `apps/web/test/**`, `apps/web/**/__tests__/**` |
| A1, A2, I, D | N/A | No changes |

## Data flow and interfaces

```
[Page /play]
    ↓ usePlayGame()
[Composable: usePlayGame]
    ↓ generateQuestion(mode), checkAnswer, nextQuestion
[Service/Util: questionGenerator]
    ↓ AdditionQuestion type, generateAdditionQuestion(mode)
[Types: game types]
    AdditionQuestion { a, b, correctAnswer, choices }
    GameMode 'upTo10' | 'upTo20'
```

- **Types**: `AdditionQuestion`, `GameMode` — future-proof for skins/levels (mode can extend).
- **Generator**: Pure function `generateAdditionQuestion(mode: GameMode): AdditionQuestion`.
- **Composable**: `usePlayGame()` — state (question, score, streak, feedback), actions (selectAnswer, nextQuestion).

## Testing strategy

| Layer | Approach |
|-------|----------|
| Generator | Unit tests: sum bounds, choice uniqueness, correct answer in choices. |
| Composable | Unit tests: score/streak logic, state transitions. |
| Page | Component test or smoke: render, interaction (if Vitest supports Vue). |
| Regression | Existing api.test.ts, HealthTest, smoke (docker) must pass. |

## Performance considerations

- Generator runs in-memory; negligible.
- No new heavy deps; bundle size impact minimal.
- Perf budget: gate F (build + size) must pass.

## Security considerations

- No auth, no persistence, no PII.
- Client-only logic; no new attack surface beyond existing web app.

## ADR-lite

- **Pure generator**: Question generation is a pure function for easy testing and determinism.
- **Composable-owned state**: Game state lives in `usePlayGame` so it can be reused and tested.
- **Types first**: `AdditionQuestion` and `GameMode` defined upfront for extensibility (levels, skins later).
