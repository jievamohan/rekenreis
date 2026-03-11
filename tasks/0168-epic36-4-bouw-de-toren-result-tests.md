---
id: 0168
epic: 36.4
title: Bouw-de-toren result modal E2E tests
scope_in:
  - apps/web/e2e/minigame-result-modal.spec.ts
scope_out:
  - Epic 36.5
lanes: [T]
gates: [C, D, F]
risk_tags: []
acceptance:
  - completeBouwDeToren helper (keyboard: block + zone + Enter)
  - Level 5: 0 stars (all wrong) and 3 stars (all correct) tests green
  - Modal: performance-bar, stars, comboMax=0
---

# Task 0168 — Epic 36.4 Bouw-de-Toren Result Tests

## Requirements
- completeBouwDeToren helper: drag 2 blocks (correct or wrong) via keyboard
- Test level 5: 0 stars (all wrong towers), 3 stars (all correct towers)
- Modal assertions: correctRounds/totalRounds, stars, comboMax=0
