# UX — Epic 28 (UX Designer)

## Primary Screens Impacted

- `/play` — level complete flow
- `LevelCompleteModal` — star display
- `/map` — node star display
- `MistakesReview` — retry CTA (unchanged)

## UX Changes

1. **Star display:** Modal and map show 0–3 stars (0 when below threshold). No change to visual layout; only the value changes.
2. **Feedback copy:** LevelCompleteModal messages (perfect/great/good) may need a 0-star variant (e.g. "Probeer opnieuw").
3. **Retry flow:** Already present; player can retry from MistakesReview or replay from map. No change.
4. **Progress bar:** No change; rounds completed as today.

## Component Catalog

- `LevelCompleteModal` — accept stars 0–3; optional 0-star message
- `MapNode` — display 0–3 stars (already supports 0 via starsFor)
- `useLevelProgress` — allow 0 stars in schema (or keep 1–3 if threshold guarantees ≥1)
- `play.vue` — compute stars from correctCount + thresholds

## Tap Targets & Accessibility

No new interactive elements. Existing CTAs unchanged.
