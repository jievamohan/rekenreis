# Epic 8 — Content Packs per Mode + Pacing Rules: Architecture

## Data Flow

```
play.vue
  └─ effectiveModeParam → interactionMode (classic | timed-pop | build-bridge)
  └─ levelPack = loadPackForMode(interactionMode)  [new]
  └─ usePlayGame(mode, { source, levelPack })

usePlayGame
  └─ if source=pack && levelPack.length > 0:
       levels = applyPacing(levelPack, seed)  [new]
       question = generateQuestionFromLevel(levels[index], rng)
```

## Schema Changes

### Level (extended)

- `modeIds?: InteractionModeId[]` — optional; if absent, applies to all modes
- `pacingTag?: 'easy' | 'normal' | 'challenge'` — optional; maps from difficultyTag or explicit

### Pacing Engine

- Input: Level[], seed
- Output: Level[] (reordered)
- Invariant: never two consecutive challenge levels
- Pattern: e.g. easy→normal→easy→challenge→easy (configurable)

## Pack Loading

- `content/levels.classic.v1.json`
- `content/levels.timed-pop.v1.json`
- `content/levels.build-bridge.v1.json`
- Lazy import or static import per mode; validate on load.
