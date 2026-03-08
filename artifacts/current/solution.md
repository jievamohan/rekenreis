# Solution — Epic 28 (Solution Designer)

## Implementation Plan

### 1. Session Correct Count

- Extend `useMistakes` or add `useSessionStats` to track:
  - `correctCount` (increment on correct)
  - `totalRounds` (from roundsPerLevel)
- Alternative: derive from `roundOutcome` if it exposes correct count; or track in play.vue via ref that increments on `advanceRound('correct')`.

### 2. Star Computation

- Create `computeStars(correctCount: number, totalRounds: number, thresholds?: [number, number, number]): number`
- Default thresholds: [3, 6, 9] for 10 rounds
- Returns 0–3

### 3. play.vue

- Replace `mistakeCount.value === 0 ? 3 : ...` with `computeStars(correctCount.value, roundsPerLevel.value)`
- Ensure `correctCount` is tracked (e.g. ref incremented in advanceRound when outcome === 'correct')

### 4. useLevelProgress

- `completeLevel`: accept stars 0–3; remove clamp to min 1 (currently `Math.max(1, Math.min(3, ...))`)
- Keep `best = Math.max(prev, stars)` — no downward overwrite

### 5. profileSchema

- `isValidV1`: allow `stars >= 0 && stars <= 3` for levelProgress

### 6. LevelCompleteModal

- Support stars === 0: show "Probeer opnieuw" or similar
- nl.json: add `levelComplete.tryAgain` for 0 stars

### 7. MapNode

- Already uses `starsFor(level)` — 0 will display as no stars (verify)

## Files

- `apps/web/utils/starScoring.ts` (or composable)
- `apps/web/pages/play.vue`
- `apps/web/composables/useLevelProgress.ts`
- `apps/web/composables/useMistakes.ts` or new `useSessionStats`
- `apps/web/utils/profileSchema.ts`
- `apps/web/components/modals/LevelCompleteModal.vue`
- `apps/web/content/locales/nl.json`
