---
id: "0124"
title: "fish-feed-creative"
owner: "orchestrator"
status: "pending"
scope_in:
  - "Aquarium-scene layout: vis centraal, pellets verspreid in het water"
  - "Timer in-scene: waterniveau daalt OF zandloper (niet generieke balk bovenaan)"
  - "Correct tap: pellet vliegt naar vis, vis 'eet' (korte animatie)"
  - "Wrong tap: pellet terug / vis schudt zacht; retry mogelijk"
  - "Reduced motion: animaties uit bij prefers-reduced-motion"
scope_out:
  - "Andere minigames wijzigen"
  - "Level-map wijzigen"
  - "Nieuwe assets > 2KB"
  - "API/backend"
acceptance:
  - "Layout onderscheidend: aquarium-scene, niet 'timer + rij knoppen'"
  - "Timer visueel geïntegreerd in scene"
  - "Correct tap: pellet-feedback + vis eet"
  - "Wrong tap: pellet terug, vis schudt; retry mogelijk"
  - "Timeout: hint + continue (ongewijzigd)"
  - "Keyboard + tap flows blijven werken (E2E groen)"
  - "Reduced motion: geen storende animaties"
  - "Bundle budget en diversity gate PASS"
lanes:
  - name: "W1"
    files: ["apps/web/components/minigames/MinigameFishFeed.vue"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "CSS animaties; reduced motion fallback"
---

## Context

Feature: Fish Feed (Level 15) creatiever maken. Layout en gameplay lijken te veel op andere minigames. We maken een aquarium-scene met timer in-scene, pellets verspreid in het water, en visuele feedback bij correct/wrong.
