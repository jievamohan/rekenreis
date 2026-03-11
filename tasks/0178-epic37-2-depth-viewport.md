---
id: 0178-epic37-2-depth-viewport
title: Diepte + DOM-verwijdering buiten viewport
scope_in:
  - MinigameFishFeed: depth effect (scale, blur, opacity)
  - IntersectionObserver: remove fish when outside viewport
  - Spawn new fish when count < 2
scope_out:
  - Epic 37.3 polish
lanes: [W1]
file_globs: [apps/web/components/minigames/MinigameFishFeed.vue]
gates: [C, F]
risk_tags: []
acceptance:
  - Visuele diepte zichtbaar (scale + blur)
  - Vissen verdwijnen uit DOM buiten viewport
  - Nieuwe spawnen om count 2-5 te behouden
  - typecheck, build green
---

# Epic 37.2 — Diepte + DOM-verwijdering buiten viewport

## Acceptance criteria
- [ ] Diepte: voorgrond groter/scherp, achtergrond kleiner + blur + lagere opacity
- [ ] Wanneer vis buiten viewable area komt: remove from DOM
- [ ] Spawn nieuwe vis wanneer count < 2 (blijf tussen 2–5)
- [ ] typecheck, build green
