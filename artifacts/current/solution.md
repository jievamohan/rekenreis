# Epic 21.2 — Solution (Implementation Approach)

**Source:** docs/design/epic-21.md

## Order of Implementation

1. **Types first:** `minigame.ts` (MinigameId, MinigameDefinition, MinigameMap), `difficulty.ts` (DifficultyProgression)
2. **Composables:** useMinigame (registry), useMinigameServing (shuffle bag + seed), useDifficultyProgression (chapter-based ranges)
3. **MinigameRenderer:** Vue component with defineAsyncComponent, loading/error/a11y fallback to Keypad
4. **JSON content:** minigame-map.v1.json with version + entries (direct or weighted pool per level range)

## Key Technical Choices

- **createSeededRng:** Deterministic RNG for serving; seed = sessionSeed + levelIndex
- **Shuffle bag:** No-repeat window N=2–3; bag exhaustion triggers refill
- **Resolution order:** byLevelId > byChapter > byPack > default (from mapping table)

## Integration Points

- usePlayGame (existing) generates question
- useMinigameServing.pick(levelId, seed) selects minigameId
- MinigameRenderer resolves component via useMinigame
- Minigame receives question + onAnswer (integration in later epics)
