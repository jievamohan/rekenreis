---
id: 0154-epic34-4-stars-progress
title: Epic 34.4 — Bouw de Toren: Stars + Progress
scope_in:
  - MinigameBouwDeToren.vue: add progress indicator with stars (ronde + level-sterren)
  - content/levels.bouw-de-toren.v1.json: level configs with starThresholds
  - useTowerLevelEngine: ensure starThresholds configurable; stars already computed
scope_out:
  - Epic 34.5, 34.6
lanes:
  - W1
  - W2
file_globs:
  - apps/web/components/minigames/MinigameBouwDeToren.vue
  - apps/web/content/levels.bouw-de-toren.v1.json
  - apps/web/composables/useTowerLevelEngine.ts
gates:
  - C
  - F
acceptance:
  - Sterren correct berekend (engine already does this)
  - Progress zichtbaar (ronde-nummer + level-sterren during play)
  - starThresholds in level-definitie
  - Typecheck, build green
---

# Epic 34.4 — Bouw de Toren: Stars + Progress

## Requirements

- Sterren: 1/2/3 op basis van correcte rondes; configureerbaar per level of via formule
- computeStars of equivalent voor Bouw de Toren thresholds
- Progress indicator: ronde-nummer, level-sterren (als van toepassing)
- Level config: starThresholds in level-definitie

## Acceptance

- Sterren correct berekend
- Progress zichtbaar
- Typecheck, build green
