---
id: "0123"
title: "treasure-dive-creative"
owner: "orchestrator"
status: "pending"
scope_in:
  - "Kist open/close animatie bij correcte drop"
  - "Wrong-drop: edelsteen springt terug, kist schudt"
  - "Edelstenen subtiele float in pool"
  - "Zeebodem-strook rond kist"
  - "Reduced motion: animaties uit bij prefers-reduced-motion"
scope_out:
  - "Andere minigames wijzigen"
  - "Level-map wijzigen"
  - "Nieuwe assets > 2KB"
  - "API/backend"
acceptance:
  - "Correcte drop: kist opent kort, gloed; volgende ronde"
  - "Wrong drop: edelsteen bounce-back, kist wobble; retry mogelijk"
  - "Edelstenen zweven subtiel in source-zone"
  - "Keyboard + drag flows blijven werken (E2E groen)"
  - "Reduced motion: geen storende animaties"
  - "Bundle budget en diversity gate PASS"
lanes:
  - name: "W1"
    files: ["apps/web/components/minigames/MinigameTreasureDive.vue"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "CSS animaties; reduced motion fallback"
---

## Context

Feature: Treasure Dive (Level 14) creatiever maken. Speler ervaart het als "1 van 3 aanklikken"; we versterken visuele en animatie-feedback zodat het onderscheidend aanvoelt.
