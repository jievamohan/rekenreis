---
id: 0175-bouw-de-toren-ghost-towers
title: Bouw-de-toren: ghost towers for in-round progress
status: done
scope_in:
  - TowerPuzzle.vue: props towersPerRound, currentTowerIndex; render ghost/completed/active towers
  - MinigameBouwDeToren.vue: pass towersPerRound, currentTowerIndex to TowerPuzzle
scope_out:
  - useTowerLevelEngine
lanes:
  - W1
file_globs:
  - apps/web/components/minigames/MinigameBouwDeToren.vue
  - apps/web/components/minigames/bouw-de-toren/TowerPuzzle.vue
gates:
  - C: typecheck clean
  - D: security baseline
  - F: build passes
risks: []
acceptance:
  - Vervaagde (ghost) torens zichtbaar voor torens die nog moeten komen
  - Voltooide torens ingevuld weergegeven
  - Actieve toren = huidige 2 dropzones
  - Typecheck, build green
---

# Bouw-de-toren: Ghost towers for in-round progress

## Requirements

- TowerPuzzle ontvangt props: towersPerRound, currentTowerIndex
- Render een rij van towersPerRound "torens"
- Index < currentTowerIndex: completed (ingevuld)
- Index === currentTowerIndex: actieve dropzones (zone1, zone2)
- Index > currentTowerIndex: ghost (vervaagd, dashed, geen interactie)
- MinigameBouwDeToren geeft engine.towersPerRound, engine.currentTowerIndex door

## Acceptance

- Ghost torens zichtbaar
- Completed torens ingevuld
- Actieve toren werkend
- Typecheck, build green
