# Backlog — Epic 27

## Micro-Epics (Slices)

Each slice ≤ 5 tasks, visible milestone.

### Epic 27.1 — Coral Minigame: Core Mechanic + Assets
- **Milestone:** Drag-to-place coral on reef works; reef + pieces visible
- **Tasks:** New MinigameCoralBuilder (drag), reef + coral SVGs, basic layout
- **Acceptance:** Drag correct piece → answer; keyboard fallback

### Epic 27.2 — Coral Minigame: Polish + Feedback
- **Milestone:** Animations, wrong-answer feedback, hint after 2 wrong
- **Tasks:** Snap-in, wobble-return, hint logic, reduced motion
- **Acceptance:** Feels like a kids' game; a11y and reduced-motion pass

### Epic 27.3 — Coral Minigame: Integration + E2E
- **Milestone:** Registry update, Dutch copy, E2E green
- **Tasks:** useMinigame contractV2, nl.json, E2E updates, visual baseline
- **Acceptance:** Full flow works; CI green; bundle budget passes

## Order

- 27.1 → 27.2 → 27.3 (foundation → polish → integration)

## Out of Scope

- Other minigames
- Map scroll / decoration (Epic 26)
- New math operators
