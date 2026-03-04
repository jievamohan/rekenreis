# Epic 19.1 — Backlog (Slice: Tokens & No-White)

## Scope_in

- Update tokens.css: underwater palette (deep water gradient bg, no #ffffff surfaces)
- Update graphics.css: underwater-themed graphics tokens
- GameStageCard: use themed surface (glass/teal, not white)
- app.vue: ensure root uses new --app-bg
- Remove hardcoded #fff, #ffffff from dominant surfaces
- Keep --app-tap-min, focus states, reduced motion
- Tests: typecheck, build, smoke green

## Scope_out

- AppShell/NavTabs redesign (Epic 19.2)
- New SVG assets (Epic 19.3)
- Page unification beyond tokens (Epic 19.4)
- Full a11y audit (Epic 19.5)

## Risks

- Contrast: dark backgrounds require light text; ensure WCAG AA
- Mitigation: use art-direction palette (--app-text: #e0f7fa on dark)

## Task List

| # | Title | Lanes | Gates | Acceptance |
|---|-------|-------|-------|------------|
| 1 | epic19-1-tokens | W1 | C,D,F | tokens.css underwater palette; no #fff surfaces |
| 2 | epic19-1-graphics | W1 | C,D,F | graphics.css underwater tokens |
| 3 | epic19-1-surfaces | W1 | C,D,F | Remove hardcoded white; GameStageCard themed |
| 4 | epic19-1-verify | T | C,D,F | typecheck, build, smoke green |
