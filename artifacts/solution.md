# Epic 9 — Adaptive Assistance: Solution

## Task Breakdown

1. **assistance-state** (W2): Create useAssistance composable; wrong-answer counter; hint-reveal trigger (2 wrong → show hint)
2. **hint-components** (W1): HintDots, HintNumberLine, HintGrouping components; plug into SkinRoundProps
3. **play-integration-assistance** (W1,W2): Wire useAssistance into play.vue; pass hintToShow to skins; integrate hint components
4. **pacing-intervention** (W2): When wrongStreak >= 3, prefer easier levels for next 2 rounds (pack mode only)
5. **tests-assistance** (T): Unit tests for assistance triggers; deterministic; no infinite loops; E2E smoke

## Scope Reduction for 5 Tasks

- **Choice reduction**: Defer to later (simplify)
- **Persistence**: Session-only for Epic 9; full per-profile in Epic 10
- **Hint types**: Implement dots + number-line; grouping as "dots with grouping" variant

## Determinism

- Assistance triggers are pure functions of (wrongCount, threshold)
- No randomness in hint reveal
- Tests use fake feedback sequence
