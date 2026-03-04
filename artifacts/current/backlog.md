# Epic 17 — Graphics v1: Backlog

## Epic Summary

Build a truly kid-friendly **graphical** minigame. Transform build-bridge from form-like (buttons, gradients) to a game scene with background, character/objects, and answer choices as game objects (planks).

## Scope In

- Planning: art-direction.md, game-feel.md, motion-audio.md, assets.md ✓
- Assets pipeline: `apps/web/assets/graphics/`, SceneLayout component
- Graphical build-bridge: scene, draggable planks as objects, wrong-drop (wobble + return + hint after 2 wrong)
- Keyboard alternative, reduced motion
- Unit tests + smoke update

## Scope Out

- Multiple new graphical modes
- High-fidelity art packs
- Heavy canvas/game engine libs

## Risks + Mitigations

| Tag | Risk | Mitigation |
|-----|------|------------|
| perf | Bundle bloat | CSS/SVG only; no heavy deps |
| a11y | Drag-only blocks keyboard | Keyboard path: select → place |
| perf | Animation jank | prefers-reduced-motion disables non-essential |

## NFRs

- **Perf**: Bundle within budget; no new heavy deps
- **Security**: No new attack surface; frontend-only
- **A11y**: Keyboard playable; big tap targets

## Task List

| # | Task | Lanes | Gates |
|---|------|-------|-------|
| 1 | 0092-graphics-assets-scene | W1 | C, D, F |
| 2 | 0093-graphics-build-bridge-visual | W1 | C, D, F |
| 3 | 0094-graphics-wrong-drop-hint | W1 | C, D, F |
| 4 | 0095-graphics-reduced-motion | W1 | C, D, F |
| 5 | 0096-graphics-tests-smoke | T, I | C, D, F |
