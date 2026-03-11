# Epic 41 Design Bible — Fish Count & Direction Balance

> Improve Fish Feed minigame: more fish (4–8), always both swim directions visible.

---

## 1. Vision & Success Criteria
- Visjes variëren van 4 tot 8 per vraag
- Altijd visjes in beide zwemrichtingen (L→R én R→L zichtbaar)

## 6. Technical Implementation
- COUNT_MIN: 2 → 4, COUNT_MAX: 5 → 8
- ensureFishCount: ondergrens 4
- Richting-balans: bij initiale spawn en bij respawn zorgen dat minstens 1 LTR en 1 RTL aanwezig is

## 9. Slice Map
- Epic 41.1 — Fish count 4–8 + direction balance
  - MinigameFishFeed.vue: COUNT_MIN=4, COUNT_MAX=8, enforce both directions
