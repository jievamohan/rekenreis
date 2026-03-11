---
id: 0207-epic43-1-timeout-wrong
title: Result Screen: Timeout telt als fout
scope_in:
  - Minigames timeout emit wrong answer
scope_out: []
lanes: [W1]
file_globs:
  - apps/web/components/minigames/MinigameFishFeed.vue
  - apps/web/components/minigames/MinigameBubblePop.vue
  - apps/web/components/minigames/MinigameMemoryMatch.vue
gates: [C, F]
risk_tags: []
acceptance:
  - Timeout telt als fout
  - 0 antwoorden → 0 van 10
---

# Epic 43.1
