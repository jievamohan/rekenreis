# Epic 9 — Adaptive Assistance: Architecture

## Layer Overview

```
play.vue
  └── usePlayGame (existing) + useAssistance (new)
        └── assistance state: wrongCount, hintRevealed, strugglingRoundsLeft
  └── Skin components
        └── receive hintToShow, reducedChoices from assistance
        └── HintDots / HintNumberLine / HintGrouping (new components)
```

## State Flow

- **usePlayGame**: continues to own question, score, streak, feedback
- **useAssistance**: consumes feedback + question; exposes:
  - `hintToShow: 'dots' | 'number-line' | 'grouping' | null`
  - `reducedChoices: number[] | null` (subset when reduced)
  - `wrongCountThisQuestion: number`
- **SkinRoundProps**: extend with optional `hintToShow`, `reducedChoices` (backward compatible)

## Assistance Rules (deterministic)

1. On `feedback.correct === false`: increment wrongCount (per question or per session—per question is simpler)
2. When wrongCount >= 2: set hintToShow based on level.hintMode or default 'dots'
3. On nextQuestion: reset wrongCount, hintToShow; optionally persist to localStorage
4. Pacing: usePlayGame/level pack already ordered; "easier for a few rounds" = advance pack cursor to next easy-level when struggling

## Persistence (minimal for Epic 9)

- Key: `rekenreis_assistance_v1`
- Value: `{ wrongStreak: number, lastReset: number }` (session-only for now; no child profile yet)
- Reset on new session (page load) or when 2 correct in a row
