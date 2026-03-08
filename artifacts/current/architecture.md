# Architecture — Epic 28 (Principal Architect)

## Scope

- `play.vue` — star computation at level complete
- `useLevelProgress` — completeLevel accepts 0–3; best-only logic
- `useMistakes` or new `useSessionStats` — track correctCount per session
- `profileSchema` — allow stars 0–3 in levelProgress validation

## Data Flow

1. **Session:** Each round records outcome (correct/wrong/timeout) via `roundOutcome.recordRoundOutcome` or equivalent.
2. **Level complete:** Compute `correctCount` from session outcomes.
3. **Stars:** `computeStars(correctCount, totalRounds, thresholds)` → 0–3.
4. **Persist:** `completeLevel(level, stars)` — `useLevelProgress` keeps `Math.max(prev, stars)`.

## Threshold Config

- Add `STAR_THRESHOLDS` in config (e.g. `apps/web/config/starThresholds.ts` or content JSON)
- Default: [3, 6, 9] for 10 rounds → 1/2/3 stars

## Schema Change

- `LevelStars.stars`: allow 0–3 (currently 1–3 in `isValidV1`)
- Migration: existing data stays valid (no 0s in legacy)
