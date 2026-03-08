# Architecture — Epic 28: New Minigame (Replace Coral)

## Component Structure

- **Replace:** `MinigameCoralBuilder.vue` → new component (e.g. `MinigameMemoryMatch.vue`)
- **Keep:** `MinigameRenderer.vue`, `useMinigame.ts` contract (props: question, difficultyParams; emit: answer)
- **Update:** `useMinigame.ts` registry — replace coral-builder definition with new minigame
- **Update:** `minigame-map.v1.json` — coral-builder remains in map (same slot) but points to new component

## Interaction Type

- **memory-flip** (new in Contract v2)
- **layoutClass:** `layout-match-grid` (already exists) or new `layout-memory-cards` if we add it

## Asset Pipeline

- New assets in `assets/graphics/minigames/memory-match/` (or equivalent)
- Card back SVG, card face styling
- Total < 15 KB

## Performance Constraints

- Lazy-load via defineAsyncComponent (unchanged)
- Bundle budget must pass
- No new heavy dependencies

## Diversity Gate

- Replacing drag-drop (coral) with memory-flip improves diversity
- No new duplication; gate should pass
