# Epic 21.3 — Architecture

**Source:** docs/design/epic-21.md

## Components

- `MinigameBubblePop.vue` — receives `AdditionQuestion` + `onAnswer`
- `MinigameTreasureDive.vue` — receives `AdditionQuestion` + `onAnswer`
- Both registered in `useMinigame` composable
- `MinigameRenderer` resolves component by id, passes props

## Integration

1. `usePlayGame` generates question (unchanged)
2. `useMinigameServing.pick(levelId, seed)` selects minigameId
3. `MinigameRenderer` resolves component via `useMinigame`
4. Minigame receives `question` + `onAnswer`, calls `onAnswer(choice)` on user action
5. `usePlayGame.selectAnswer` validates and updates score/feedback

## File Locations

- Components: `apps/web/components/minigames/`
- Assets: `apps/web/assets/graphics/minigames/bubble-pop/`, `treasure-dive/`
- Types: `apps/web/types/minigame.ts`

## Lazy Loading

- Minigame components loaded via `defineAsyncComponent`
- Chunks excluded from initial bundle
