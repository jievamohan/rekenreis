---
id: 0152-epic34-2-bouw-de-toren-ui
title: Epic 34.2 — MinigameBouwDeToren + TowerPuzzle + drag-drop
status: done
scope_in:
  - MinigameBouwDeToren.vue: levelConfig props, useTowerLevelEngine, emit levelComplete({ stars })
  - TowerPuzzle.vue: target, 2 dropzones, blocks pool, drag 2 blocks, validate sum
  - Keyboard: Tab/Enter/Space (treasure-dive model)
  - nl.json i18n
scope_out:
  - Error flow (hint, lastChance) UI - Epic 34.3
  - play.vue integration - Epic 34.5
lanes:
  - W1: apps/web/components/minigames/**/*.vue
  - W2: apps/web/content/locales/nl.json
  - T: apps/web/test/*.ts
gates:
  - C: typecheck clean
  - D: security baseline
  - F: build passes
risks: []
acceptance:
  - Minigame renders; drag 2 blocks; correct sum → next tower
  - Keyboard-playable (Tab/Enter/Space)
  - Typecheck, build green
---

# Epic 34.2 — Bouw de Toren: Core Mechanic + UI

## Requirements

- MinigameBouwDeToren.vue: level-config props; integreer useTowerLevelEngine; emit levelComplete({ stars })
- TowerPuzzle.vue: doelgetal prominent; 2 dropzones; blokkenpool; drag 2 blokken, valideer sum=target
- Keyboard: Tab/Enter/Space voor selectie en plaatsing (zelfde model als treasure-dive)
- Geen shared pool; elke toren eigen verse pool

## Acceptance

- Minigame rendert; drag 2 blokken; correcte som → volgende toren
- Keyboard-playable
- Typecheck, build green
