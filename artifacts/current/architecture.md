# Epic 21.2 — Architecture

**Source:** docs/design/epic-21.md §6

## Type System

| Type | Purpose |
|------|---------|
| `MinigameId` | Union: 'bubble-pop' \| 'treasure-dive' \| 'fish-feed' \| 'coral-builder' \| 'submarine-sort' \| 'starfish-match' |
| `MinigameDefinition` | id, component, requiredAssets, difficultyKnobs, a11yFallback |
| `MinigameMap` | version + entries (direct or weighted pool per level range) |
| `DifficultyProgression` | math ranges per chapter + minigame params per chapter |

## Composables

| Composable | Purpose |
|------------|---------|
| `useMinigame` | Registry + resolution (id → component) |
| `useMinigameServing` | Shuffle bag, no-repeat window N=2–3, deterministic seed via createSeededRng |
| `useDifficultyProgression` | operandMin/Max/choiceCount from chapter + minigame params |

## Component

- **MinigameRenderer.vue:** defineAsyncComponent loader; loading/error states; a11y fallback to Keypad.

## File Layout

- Types: `apps/web/types/minigame.ts`, `apps/web/types/difficulty.ts`
- Composables: `apps/web/composables/useMinigame.ts`, `useMinigameServing.ts`, `useDifficultyProgression.ts`
- Component: `apps/web/components/minigames/MinigameRenderer.vue`
- Content: `apps/web/content/minigame-map.v1.json`
