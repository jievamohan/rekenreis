# Epic 17 — Graphics v1: Discovery

## Summary

Build a truly kid-friendly **graphical** minigame (not a styled form). The build-bridge mode exists today but is form-like: text prompt, gradient rectangles, plain buttons. Epic 17 transforms it into a visual game scene with background, character/objects, and answer choices rendered as game objects (e.g., planks, balloons).

## Definition of "Graphical" (non-negotiable)

- **Interaction**: Primarily visual and spatial (drag/drop or tap-on-objects), not text buttons
- **Scene**: Looks like a game scene with background + character/objects
- **Answer choices**: Rendered as game objects (balloons, planks, food items), not plain buttons with borders

## Current State

- **ModeBuildBridge.vue**: Exists with drag/drop + keyboard alternative; uses gradient divs, text prompt "a + b = ?", button-styled planks
- **Core loop**: usePlayGame, useAssistance, level packs — all remain source of truth
- **Mode selector**: PlayModeSelector with Classic, Timed Pop, Build Bridge; kid-friendly but minimal
- **Assets**: No dedicated graphics pipeline; no `assets/graphics/` folder

## Scope In

1. Planning deliverables (design-first): art-direction.md, game-feel.md, motion-audio.md, assets.md
2. Assets pipeline: `apps/web/assets/graphics/`, scene layout component
3. One graphical mode: build-bridge (drag & drop)
   - Bridge gap scene, draggable planks with numbers
   - Wrong drop: gentle wobble + return plank + hint after 2 wrong
   - Keyboard alternative (select plank → place)
4. Mode selector: allow switching to build-bridge (kid-friendly)
5. Tests: unit (mode contract, drag/drop state), e2e smoke (switch → complete one round)
6. Reduced motion: `prefers-reduced-motion` disables non-essential animation
7. Performance: CSS/SVG only, no heavy canvas/game engine

## Scope Out

- Multiple new graphical modes
- High-fidelity art packs (placeholders OK; must look like game scene)
- New operators or math logic changes

## Key Constraints

- Keep existing core loop + level engine as source of truth
- No duplicated math logic
- CI green; no breakage of classic/timed-pop modes
- Bundle size within budget
