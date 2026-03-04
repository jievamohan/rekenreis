---
id: "0109"
title: "Create underwater SVG assets + background patterns"
lane: W1
gates: [C, F]
scope_in:
  - "apps/web/assets/graphics/objects/*.svg"
  - "apps/web/assets/graphics/backgrounds/*.svg"
scope_out:
  - "apps/web/components/**"
  - "apps/web/assets/css/**"
risk_tags: [perf]
depends_on: []
---

# Task 0109 — Create underwater SVG assets + background patterns

## Goal

Create 12+ underwater-themed SVG assets and 2 background pattern SVGs. Organize them in `assets/graphics/backgrounds/`, `objects/`.

## Acceptance Criteria

- [ ] At least 12 new underwater SVG files in `assets/graphics/objects/`
- [ ] 2 background pattern SVGs in `assets/graphics/backgrounds/`
- [ ] Each SVG < 2KB
- [ ] Total new assets < 50KB
- [ ] No embedded scripts or external fetches in any SVG
- [ ] SVGs are valid XML

## Assets to create

### Objects (assets/graphics/objects/)
1. fish-small.svg — small decorative fish
2. fish-large.svg — bigger fish variant
3. bubbles.svg — cluster of bubbles
4. seaweed.svg — kelp/seaweed
5. coral.svg — coral formation
6. shell.svg — seashell
7. starfish.svg — starfish
8. jellyfish.svg — jellyfish
9. seahorse.svg — seahorse
10. turtle.svg — sea turtle
11. octopus.svg — octopus
12. crab.svg — crab

### Backgrounds (assets/graphics/backgrounds/)
13. bubble-pattern.svg — repeating bubble pattern
14. wave-overlay.svg — wave/ripple pattern overlay
