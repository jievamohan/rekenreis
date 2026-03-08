# Backlog — Epic 28

## Micro-Epics (Sliced)

1. **Epic 28.1 — Star Scoring Logic + Session Stats**
   - Track correctCount per session
   - computeStars(correctCount, totalRounds, thresholds)
   - Replace mistake-based stars in play.vue
   - Unit tests for computeStars and useLevelProgress (0 stars, best-only)

2. **Epic 28.2 — Schema + Persistence + UI**
   - profileSchema: allow stars 0–3
   - useLevelProgress: accept 0, remove min-1 clamp
   - LevelCompleteModal: 0-star message (nl.json)
   - MapNode: verify 0 stars display
   - E2E: replay, best-only, threshold boundaries

## Out of Scope

- New minigames, map scroll, background decoration (other epics)
- Changing rounds per level
- Backend/API changes
