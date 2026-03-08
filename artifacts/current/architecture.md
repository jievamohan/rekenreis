# Architecture — Epic 27 (Principal Architect)

## Scope

- **In scope:** Replace `MinigameCoralBuilder.vue` with new implementation
- **Out of scope:** MinigameRenderer, useMinigame registry, play.vue flow, other minigames

## Component Boundary

```
MinigameRenderer
  └── MinigameCoralBuilder.vue (REPLACED)
        Props: question (AdditionQuestion), difficultyParams?
        Emit: answer(choice: number)
```

## Contract (Unchanged)

- Same props/emit as all minigames
- Same `coral-builder` id in useMinigame registry
- MinigameRenderer loads by id; no routing changes

## Asset Pipeline

- New assets: `assets/graphics/minigames/coral-builder/`
  - reef-base.svg (or similar)
  - coral-piece-1.svg, coral-piece-2.svg (or parametric/colored variants)
- Reuse existing underwater tokens and gradients

## Performance

- Lazy-loaded via MinigameRenderer (defineAsyncComponent)
- Asset budget: new SVGs < 15 KB total
- No new heavy dependencies

## Integration Points

- `useMinigame.ts`: Update `contractV2` for coral-builder (interactionType: drag-drop, layoutClass: layout-drag-reef)
- `minigame-map.v1.json`: No change (coral-builder already in map)
- E2E: Update coral-builder assertions if interaction changes (drag vs tap)
