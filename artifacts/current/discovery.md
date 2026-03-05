# Epic 21.2 — Discovery (Business Analysis)

**Source:** docs/design/epic-21.md

## What Epic 21.2 Delivers

### Business Value

- **Foundation for varied play:** Establishes the plumbing so future epics can plug in 6 distinct minigames (Bubble Pop, Treasure Dive, Fish Feed, Coral Builder, Submarine Sort, Starfish Match).
- **Deterministic serving:** Same seed + mapping → same minigame sequence per session. Enables reproducible tests and predictable UX.
- **Difficulty scaffolding:** Math ranges and minigame params scale by chapter/level. Ready for use when minigames land.

### User-Facing Outcomes

- MinigameRenderer wired into play flow; system picks minigame per round (visible in dev tools or via test).
- If a minigame fails to load, Keypad fallback ensures play continues.
- No visible minigame content yet—only the loader and fallback.

### Non-Goals

- Implementing any of the 6 minigames.
- i18n, animations, new assets.
- Backend/API changes.

### Acceptance Criteria

- Types clean (typecheck passes).
- Serving deterministic with seed.
- Difficulty scales per chapter.
- MinigameRenderer loads with fallback.
