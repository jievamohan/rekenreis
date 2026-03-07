# Plan — Fish Feed Creatiever

**Run ID:** fish-feed-creative-2025-03  
**Branch:** feat/0124-fish-feed-creative

## Samenvatting

Fish Feed (Level 15) is creatiever gemaakt met:
- **Aquarium-scene:** Vis centraal, pellets verspreid in het water
- **Timer in-scene:** Waterniveau daalt als de tijd verstrijkt (geen generieke balk)
- **Correct tap:** Pellet vliegt naar vis, vis "eet"
- **Wrong tap:** Pellet bounce, vis schudt; retry mogelijk
- **Reduced motion:** Alle animaties uit bij prefers-reduced-motion

## Wijzigingen

- `MinigameFishFeed.vue`: Volledige redesign
- Typecheck: PASS
- Build: PASS
