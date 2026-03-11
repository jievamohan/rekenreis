# Epic 39 Design Bible — Fish Zone Verwijderen + Zichtbaarheid

> PlanRef: artifacts/archive/epic-39.0/latest
> Bugfix: ambient fish in DOM but not visible; center fish-zone geeft vertekend beeld.

---

## 1. Vision & Success Criteria
- Probleem: Zwemmende vissen in DOM maar niet zichtbaar; center fish (fish-zone) geeft vertekend beeld
- Oplossing: Verwijder fish-zone; verbeter zichtbaarheid ambient fish (groter, minder blur op voorgrond)

## 6. Technical Implementation
- Verwijder fish-zone (center fish emoji) uit MinigameFishFeed.vue
- Verwijder fish-zone, fish-emoji, fish-waiting, fish-eat, fish-shake CSS
- Ambient fish: vergroot font-size (1.2em → 2em of meer) voor betere zichtbaarheid
- Optioneel: verlaag blur op voorgrond (depth 0)

## 9. Slice Map
- Epic 39.1 — Remove fish-zone + Improve visibility
  - Visual: Geen center vis; alleen zwemmende ambient fish + pellets
  - Acceptance: fish-zone weg, ambient fish zichtbaarder, pellets werken
