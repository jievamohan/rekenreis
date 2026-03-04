# Epic 17 — Graphics v1: Architecture

## Layering

```
play.vue (orchestrator)
  └── usePlayGame, useAssistance, useMode, useSkin
  └── <component :is="gameMode.component" v-bind="modeProps" />
        └── ModeBuildBridge (graphical)
              └── SceneLayout (background + foreground + character slot)
              └── DraggablePlank (game object)
              └── DropZone (bridge gap)
```

## Data Flow (unchanged)

- **usePlayGame**: question, feedback, selectAnswer, nextQuestion
- **useAssistance**: hintToShow (after 2 wrong)
- **SkinRoundProps**: Passed to mode component; no game logic in mode

## New Components

| Component | Responsibility |
|-----------|----------------|
| `SceneLayout` | Wrapper: background layer + foreground layer + character slot; CSS layout |
| `DraggablePlank` | Plank game object: SVG or styled div, draggable, keyboard focusable |
| `DropZone` | Bridge gap: accepts drop, keyboard place |

## Assets Pipeline

- **Location**: `apps/web/assets/graphics/`
- **Structure**: `backgrounds/`, `objects/`, `characters/` (or placeholders)
- **Format**: SVG preferred (scalable, small)
- **Import**: `~/assets/graphics/...` or via Nuxt asset handling

## Mode Contract

- ModeBuildBridge continues to implement SkinRoundProps
- Receives same props: question, feedback, onAnswer, onNext, hintToShow, etc.
- No changes to usePlayGame or level engine

## Reduced Motion

- `@media (prefers-reduced-motion: reduce)` disables:
  - Wobble on wrong
  - Celebration bounce (optional)
  - Non-essential transitions
- Keep: essential state changes (plank moves, feedback visible)
