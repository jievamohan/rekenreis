# Backlog — Epic 34: Bouw de Toren

## Epics (voorstel)

1. **34.1 — Domain Engine + Level Generator:** useTowerLevelEngine, towerLevelGenerator, types, unit tests.
2. **34.2 — Core Mechanic + UI:** MinigameBouwDeToren, TowerPuzzle, drag-drop, doelgetal, dropzones, blokkenpool.
3. **34.3 — Error Flow + Feedback:** Hint, laatste kans, ronde-skip; terugveren; correct-feedback met som.
4. **34.4 — Stars + Progress:** Sterrensysteem configureerbaar; ronde/level progress UI.
5. **34.5 — play.vue Integration:** Level-consuming flow; minigame-map; shell-collector vervanging.
6. **34.6 — Assets + Polish:** tower.svg, styling, i18n, E2E, bundle budget.

## Afhankelijkheden

- 34.2, 34.3, 34.4 bouwen op 34.1.
- 34.5 wacht op 34.2, 34.3, 34.4.
- 34.6 kan deels parallel met 34.2 (assets).

## Parallel Mogelijkheden

- 34.1 eerst (basis).
- 34.2, 34.3, 34.4 kunnen na 34.1 parallel (verschillende lanes).
- 34.6 assets parallel met 34.2; rest van 34.6 na integratie.
