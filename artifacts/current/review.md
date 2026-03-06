# Review — Epic 22.2

## Changes

1. **MinigameTreasureDive.vue**: Rewritten with pointer-event drag/drop (touch+mouse), dual-zone layout (source gems + drop chest), keyboard fallback (Enter to select gem, Enter on chest to submit).
2. **MinigameFishFeed.vue**: Timeout now shows hint overlay with correct answer ("Het antwoord is X. Goed onthouden!") and auto-continues after 2.5s. No punishment on timeout.
3. **nl.json**: Added `hintMessage` and `hintContinue` keys under `minigameFishFeed`.
4. **e2e/mechanic-upgrades.spec.ts**: 4 E2E tests covering drag/drop round, keyboard fallback, timeout hint-continue, and normal pellet selection.
