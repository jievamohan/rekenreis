---
id: 0165
epic: 36.1
title: E2E minigame-result-modal helpers + 100%/0% tests
scope_in:
  - apps/web/e2e/minigame-result-modal.spec.ts
  - apps/web/e2e/
scope_out:
  - Epic 36.2 (40%/80% tests)
  - Epic 36.4 (Bouw-de-toren)
lanes: [T]
gates: [C, D, F]
risk_tags: []
acceptance:
  - New e2e/minigame-result-modal.spec.ts with helpers answerBubblePop, answerTreasureDive, answerFishFeed, answerMemoryMatch, answerStarfishMatch (correct/wrong)
  - Tests for levels 1–4, 6 (bubble-pop, treasure-dive, fish-feed, memory-match, starfish-match) with 100% and 0% success
  - Modal assertions: visible, performance-bar, stat-items (score, tijd, combo, XP), sterren
  - timersDisabled where needed (fish-feed, starfish-match) for determinism
  - level-complete.spec.ts and interaction-diversity.spec.ts remain green
  - Playwright via docker compose run --rm e2e
---

# Task 0165 — Epic 36.1 Minigame Result Tests

## Requirements
- Create e2e/minigame-result-modal.spec.ts
- Helpers: answerBubblePop, answerTreasureDive, answerFishFeed, answerMemoryMatch, answerStarfishMatch (correct/wrong)
- Tests: level 1 (bubble-pop), 2 (treasure-dive), 3 (fish-feed), 4 (memory-match), 6 (starfish-match) with 100% and 0%
- Modal assertions: visible, performance-bar, stat-items, stars
- timersDisabled for fish-feed and starfish-match
- Existing level-complete.spec.ts and interaction-diversity.spec.ts green
