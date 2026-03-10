---
id: 0155-epic34-5-play-integration
title: Epic 34.5 — Bouw de Toren: play.vue Integration
scope_in:
  - play.vue: level-consuming flow for bouw-de-toren
  - useMinigame: register bouw-de-toren
  - minigame-map.v1.json: replace shell-collector with bouw-de-toren
  - types: MinigameId, layout-tower-dualzone
  - E2E: interaction-diversity, sorting-sequence
scope_out:
  - Epic 34.6
lanes:
  - W1
  - W2
  - T
gates:
  - C
  - D
  - F
acceptance:
  - Level 5, 11, 17, … tonen Bouw de Toren
  - Level complete → sterren, modal
  - shell-collector uit map en default pool
  - Typecheck, build green
  - E2E green
---

# Epic 34.5 — Bouw de Toren: play.vue Integration

## Requirements

- play.vue: bij currentMinigameId === 'bouw-de-toren' → level-consuming flow; wacht op levelComplete({ stars })
- completeLevel(levelId, stars); LevelCompleteModal
- useMinigame: registreer bouw-de-toren; layoutClass layout-tower-dualzone
- MinigameId union: bouw-de-toren; shell-collector vervangen in minigame-map.v1.json
- useDifficultyProgression: bouw-de-toren params
- ProblemCard verborgen voor bouw-de-toren

## Acceptance

- Level 5, 11, 17, … tonen Bouw de Toren
- Level complete → sterren, modal
- shell-collector uit map en default pool
- Typecheck, build green
