# Epic 9 — Adaptive Assistance: Discovery

## Feature Summary

Add adaptive assistance so kids don't get stuck or spam-guess. Confidence gate reveals hints after wrong answers; gentle pacing interventions ease difficulty when the child struggles.

## Current State

- **Feedback**: usePlayGame tracks correct/incorrect/timeout; skins display "Correct!" or "Not quite. The answer was X."
- **Wrong-answer tracking**: None; no count of consecutive wrong answers
- **Hints**: Level has `hintMode` (string) but it's not used for adaptive reveal; no dot/number-line visuals
- **Choice count**: Fixed per question (typically 4); no reduction for struggling
- **Pacing**: Epic 8 added pacing engine for pack ordering; no runtime difficulty switching
- **Persistence**: localStorage for preferences (mode, skin, telemetry opt-out); no assistance state

## Requirements (from Epic)

1. **Confidence gate + anti-guessing**:
   - After 2 wrong answers in a row: reveal hint (dot visuals / number line)
   - After repeated wrong: optionally reduce choice count temporarily
2. **Hint modes**:
   - Dots visual (e.g. a + b shown as dots)
   - Number line visual
   - Grouping visual
3. **Gentle pacing**:
   - If child struggles, auto-switch to easier tag for a few rounds
4. **Persistence**: Assistance state locally (per child profile if available; Epic 10 adds profiles)
5. **Tests**: Deterministic triggers, no infinite loops, no hard fail states
6. **UX**: Feedback stays positive; no negative scoring

## Non-goals

- Full personalization ML
- Parental dashboards

## Key Files

- `apps/web/composables/usePlayGame.ts` — wrong-answer count, hint-reveal state, choice-reduction
- `apps/web/composables/useAssistance.ts` — new: assistance rules, state machine
- `apps/web/components/hints/` — new: HintDots, HintNumberLine, HintGrouping
- `apps/web/types/skin.ts` — extend SkinRoundProps with `hintToShow?: ...`, `reducedChoices?: number[]`
- `apps/web/pages/play.vue` — wire assistance into game
- `apps/web/utils/levelGenerator.ts` — optionally accept reduced choice count
- `apps/web/content/*.json` — levels already have hintMode; align with new hint types
