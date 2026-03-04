# Backlog — Epic 19.3: Underwater Asset Pipeline

## Epic Summary

Add 10+ underwater SVG assets and background patterns to bring the underwater theme to life visually. Integrate patterns into the app shell and scene layout. Verify all quality gates.

## Scope

### scope_in
- Create 12+ underwater-themed SVG assets (fish, bubbles, seaweed, coral, shells, starfish, jellyfish, seahorse, turtle, octopus, crab, wave)
- Create 2 background patterns (bubble-pattern, wave-overlay)
- Organize assets in assets/graphics/backgrounds/, objects/, icons/
- Integrate at least one background pattern into AppShell or SceneLayout
- Each SVG < 2KB; total new assets < 50KB
- Bundle budget must pass (Gate F)

### scope_out
- New game modes or content packs
- Backend changes
- New animations or motion work
- Page-level theme unification (that's Epic 19.4)

## Risks + Mitigations

| Risk | Tag | Mitigation |
|------|-----|------------|
| Bundle size increase | perf | Keep each SVG < 2KB; verify budget after |
| SVG injection | security | No embedded scripts or external fetches in SVGs |

## NFRs

- Performance: bundle budget < 3MB total, < 250KB client JS
- Security: SVGs must not contain scripts or external references
- Accessibility: decorative SVGs use aria-hidden="true"

## Task List

1. **0109 — Create underwater SVG assets + background patterns** (W1, Gates C/F)
2. **0110 — Integrate patterns into AppShell and SceneLayout** (W1, Gates C/F)
3. **0111 — Verify typecheck + build + bundle budget** (T/I, Gates C/D/F)
