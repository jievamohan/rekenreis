# Epic 6 — Game Modes Framework: Architecture

## Layering

```
play.vue (routing, query params)
    │
    ├─ source: pack | infinite (content)
    ├─ mode: classic | timed-pop (interaction)
    ├─ skin: classic | monster-feed | space | pirate (visual)
    └─ difficulty: upTo10 | upTo20 (GameMode in types/game.ts)
```

## Query Param Resolution

- `source` = route.query.source ?? (route.query.mode === 'pack' ? 'pack' : 'infinite')
- `interactionMode` = ['classic','timed-pop'].includes(route.query.mode) ? route.query.mode : 'classic'
- Skin and difficulty unchanged.

## Mode Contract

```ts
// Interaction mode (new)
type InteractionModeId = 'classic' | 'timed-pop'

interface ModeRoundProps extends SkinRoundProps {
  // Same as SkinRoundProps; mode may add timer config
  timerSeconds?: number  // optional, for timed modes
}

// Mode can optionally receive recordTimeout for timed modes
interface TimedModeCallbacks {
  onAnswer: (choice: number) => void
  onNext: () => void
  recordTimeout?: () => void  // when timer expires
}
```

## Core Loop Extension

usePlayGame remains the single source of truth. For timed-pop:
- Add `recordTimeout()`: sets feedback to { type: 'timeout', correctAnswer } without changing score.
- SkinRoundProps/PlayFeedback: extend to support type 'timeout' for friendly copy.

## Component Structure

- **classic**: Existing behavior. Current skins render rounds. No change.
- **timed-pop**: New mode component. Renders question + choices (reusing skin structure or minimal duplication) + timer. On timeout: calls recordTimeout(), shows "Time's up! The answer was X.", Next enabled.

## Files

- `types/mode.ts` — InteractionModeId, ModeDefinition
- `utils/modeResolver.ts` — resolveInteractionMode(query)
- `composables/useMode.ts` — mode registry, resolve mode component
- `components/modes/ModeClassic.vue` — delegates to skin (thin wrapper)
- `components/modes/ModeTimedPop.vue` — timer + round render
- `composables/usePlayGame.ts` — add recordTimeout()
- `types/game.ts` or skin.ts — extend PlayFeedback for timeout
- `pages/play.vue` — wire mode from query, resolve mode+skin
