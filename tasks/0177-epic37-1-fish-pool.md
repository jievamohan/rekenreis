---
id: 0177-epic37-1-fish-pool
title: Fish Pool + Richting + Hoogte + Snelheid
scope_in:
  - MinigameFishFeed.vue: fish-ambient-layer with 2–5 decorative fish
  - Direction: random L→R or R→L per fish
  - Height: variable y within aquarium bounds
  - Speed: 8–20s traverse per fish
  - pointer-events: none; aria-hidden on fish layer
scope_out:
  - Viewport DOM removal (Epic 37.2)
  - Depth effect (Epic 37.2)
lanes: [W1]
file_globs: [apps/web/components/minigames/MinigameFishFeed.vue]
gates: [C, F]
risk_tags: []
acceptance:
  - 2–5 vissen zwemmen horizontaal door het aquarium
  - Pellet-click werkt ongestoord
  - Fish layer pointer-events: none, aria-hidden
  - typecheck green, build green
---

# Epic 37.1 — Fish Pool + Richting + Hoogte + Snelheid

## Acceptance criteria
- [ ] Fish Feed minigame: nieuwe laag met 2–5 decoratieve vissen
- [ ] Richting: random links→rechts OF rechts→links per vis
- [ ] Hoogte: variabele y binnen aquarium bounds
- [ ] Snelheid: variabel per vis (bijv. 8–20s traversie)
- [ ] Vissen hebben pointer-events: none; pellets blijven klikbaar
- [ ] aria-hidden op vis-laag
- [ ] typecheck green, build green

## Implementation notes
- Add `.fish-ambient-layer` inside `.aquarium`, before fish-zone
- Use emoji 🐟 or similar; CSS animation for horizontal swim
- Each fish: `{ id, y, speed, direction }` — init on mount with createSeededRng or random
- CSS: `animation: swimHorizontal { duration } linear`; `transform: scaleX(-1)` for R→L
