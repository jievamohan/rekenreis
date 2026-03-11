---
id: 0166
epic: 36.2
title: E2E minigame-result 40%/80% tests + strict assertions
scope_in:
  - apps/web/e2e/minigame-result-modal.spec.ts
scope_out:
  - Epic 36.3 (audit)
  - Epic 36.4 (Bouw-de-toren)
lanes: [T]
gates: [C, D, F]
risk_tags: []
acceptance:
  - 40%/80% tests for bubble-pop, treasure-dive, fish-feed, starfish-match
  - Strict assertions: correctCount/roundsTotal in performance-bar, scorePercent exact, stars 1/2
  - memory-match 40%/80% skipped (no wrong-round path)
  - level-complete.spec.ts and interaction-diversity.spec.ts remain green
---

# Task 0166 — Epic 36.2 Minigame Result 40%/80%

## Requirements
- Extend minigame-result-modal.spec.ts with 40% and 80% scenarios
- Controlled success: 4/10 correct (40%), 8/10 correct (80%) for 10-round minigames
- Assertions: performance-bar (correct/total), scorePercent (40/80), stars (1/2)
- memory-match: 2/5 and 4/5 for 40%/80% — skipped (mechanic has no wrong path)
