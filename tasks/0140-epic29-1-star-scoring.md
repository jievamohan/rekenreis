---
id: "0140"
status: "done"
title: "epic29-1-star-scoring"
scope_in:
  - "apps/web/utils/starScoring.ts (computeStars)"
  - "apps/web/pages/play.vue (correctCount, computeStars)"
  - "apps/web/composables/useLevelProgress.ts (accept 0 stars)"
scope_out:
  - "profileSchema (29.2)"
  - "LevelCompleteModal 0-star message (29.2)"
  - "E2E (29.2)"
lanes: ["W2"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "correctCount ref incremented on advanceRound('correct')"
  - "computeStars(correctCount, totalRounds, thresholds?) returns 0–3"
  - "Default thresholds [3, 6, 9] for 10 rounds"
  - "play.vue uses computeStars instead of mistakeCount for stars"
  - "useLevelProgress.completeLevel accepts stars 0–3 (remove min-1 clamp)"
  - "best = max(prev, stars) unchanged"
---

# Epic 29.1 — Star Scoring Logic + Session Stats

## Goal

Stars at level end reflect correct answers, not mistakes. Configurable thresholds; 0 stars possible.

## Implementation

1. Create `apps/web/utils/starScoring.ts`:
   - `computeStars(correctCount: number, totalRounds: number, thresholds?: [number, number, number]): 0 | 1 | 2 | 3`
   - Default thresholds: [3, 6, 9] for 10 rounds; derive for 5 rounds [2, 3, 4]
2. In play.vue: add `correctCount = ref(0)`, increment on `advanceRound('correct')`, reset on level start
3. Replace `mistakeCount.value === 0 ? 3 : ...` with `computeStars(correctCount.value, roundsPerLevel.value)`
4. useLevelProgress.completeLevel: change `Math.max(1, ...)` to `Math.max(0, Math.min(3, ...))`
