# Epic 13 — Share/Print Progress Summary: Discovery

## Feature Summary

Parent-friendly, local-only progress summary: rounds played, simple accuracy trend, favorite mode. Optional export via copy-to-clipboard or download JSON. No identifiers; no cloud sync.

## Problem Statement

Parents want to see how their child is progressing (rounds, accuracy, preferred mode) to support learning at home. Today there is no way to view or share a concise summary. Data exists in profile (bestScore, dailyGoal, lastMode) and in play feedback (correct/wrong/timeout) but is not aggregated or exportable.

## Users

- **Primary**: Parents/guardians reviewing child's progress
- **Secondary**: Child (with parent) viewing their own summary

## Current State

- **ProfileProgress**: `bestScore`, `dailyGoal?: { date, roundsPlayed }`
- **ProfilePrefs**: `lastMode`, `lastSkin`, `difficultyCeiling`, `hintsOn`, `soundOn`
- **useDailyGoal**: increments `roundsPlayed` on `onNext` in play.vue
- **usePlayGame**: per-round feedback (`correct`, `wrong`, `timeout`) — not persisted
- **Gap**: No accuracy tracking, no total-rounds history, no favorite-mode derivation, no summary screen, no export

## Requirements (from Epic)

1. **Summary**: rounds played, accuracy trend (simple), favorite mode
2. **Export**: local "copy to clipboard" or "download JSON" (optional)
3. **Privacy**: no identifiers, local-only by default
4. **Tests**: summary aggregation correctness
5. **Non-goals**: cloud sync, analytics dashboards

## Constraints

- Local-only: no API changes, no backend
- Lanes: W1 (pages/components), W2 (composables), T (tests); no A1/A2, I, D
- Gates: C (typecheck), D (security), F (bundle budget)
- Max 5 tasks for delivery

## Key Files

- `apps/web/utils/profileSchema.ts` — extend progress with accuracy/session history
- `apps/web/composables/useProgressSummary.ts` — new: aggregate summary, export
- `apps/web/pages/summary.vue` or `/summary` — new: summary screen
- `apps/web/pages/play.vue` — record per-round outcome for accuracy
- `apps/web/composables/usePlayGame.ts` — already emits feedback; need to persist outcome
