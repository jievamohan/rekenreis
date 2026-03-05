# Epic 21.2 — Backlog

**Source:** docs/design/epic-21.md §9 (Epic 21.2 slice)

## Tasks (5)

1. **Types** — MinigameId, MinigameDefinition, MinigameMap, DifficultyProgression in `types/minigame.ts`, `types/difficulty.ts` (Lane W2)
2. **Serving composable** — useMinigameServing: shuffle bag, no-repeat window, createSeededRng (Lane W2)
3. **Difficulty composable** — useDifficultyProgression: operandMin/Max/choiceCount, minigame params from chapter (Lane W2)
4. **MinigameRenderer** — defineAsyncComponent loader, loading/error/a11y fallback to Keypad (Lane W1)
5. **Tests** — Unit tests for serving determinism, difficulty scaling, mapping validation (Lane T)

## Dependencies

- Task 1 → 2, 3, 4
- Task 2, 3 → 4 (MinigameRenderer may use both)
- Task 5 after 1–4
