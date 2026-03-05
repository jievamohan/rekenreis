# Epic 21.5 Architecture

**Pattern:** Two Vue components reusing existing minigame pattern.

**Components:**
- `MinigameSubmarineSort.vue` — receives `question` + `onAnswer`, drag-to-compartment
- `MinigameStarfishMatch.vue` — receives `question` + `onAnswer`, tap pairs

**Integration:**
- `useMinigame` registry: add `submarine-sort`, `starfish-match`
- `MinigameRenderer` lazy-loads via `defineAsyncComponent`
- `minigame-map.v1.json`: add entries for both minigameIds

**No new composables.** Reuse `useMinigame`, `useMinigameServing`, `useDifficultyProgression`, `useI18n`.
