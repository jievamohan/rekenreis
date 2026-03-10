---
id: "0156"
title: "epic32-2-shell-collector-integration"
status: "pending"
scope_in:
  - "apps/web/composables/useMinigame.ts"
  - "apps/web/types/minigame.ts"
  - "apps/web/content/minigame-map.v1.json"
  - "apps/web/composables/useDifficultyProgression.ts"
  - "apps/web/pages/play.vue"
  - "apps/web/e2e/"
  - "apps/web/content/locales/nl.json"
scope_out:
  - "apps/api"
lanes: ["W1", "T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "Level 5, 11, 17, … show Shell Collector; no ProblemCard"
  - "Map → play level 5 → Shell Collector round completes"
  - "submarine-sort removed from codebase"
  - "Typecheck, build, E2E green"
---

# Epic 32.2 — Shell Collector: Integration

## Goal

Integrate Shell Collector; remove submarine-sort from map and registry.

## Implementation

1. useMinigame: replace submarine-sort with shell-collector
2. MinigameId union: submarine-sort → shell-collector
3. minigame-map.v1.json: rules and default pool use shell-collector
4. useDifficultyProgression: shell-collector params
5. play.vue: hide ProblemCard when currentMinigameId === 'shell-collector'
6. Remove MinigameSubmarineSort.vue
7. E2E: interaction-diversity, sorting-sequence updated for shell-collector
