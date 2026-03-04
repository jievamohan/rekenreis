# Epic 19.2 — Backlog (Slice: Shell & Nav Redesign)

## Scope_in

- AppShell: underwater background pattern, themed top bar (profile pill, Choose game)
- GameStageCard: integrate with new tokens from 19.1
- NavTabs: replace emoji icons with underwater SVG icons (fish, chart/bubbles, gear/coral)
- Add assets/graphics/icons/ for nav SVGs
- Playful typography (Nunito or Fredoka One) applied consistently
- Keep a11y: 44px tap targets, focus states
- Tests: typecheck, build, smoke (nav tabs work)

## Scope_out

- Full asset pipeline (Epic 19.3)
- Page unification (Epic 19.4)

## Task List

| # | Title | Lanes | Gates | Acceptance |
|---|-------|-------|-------|------------|
| 1 | epic19-2-nav-icons | W1 | C,D,F | SVG icons in assets/graphics/icons/ |
| 2 | epic19-2-shell-bg | W1 | C,D,F | AppShell underwater background |
| 3 | epic19-2-nav-icons-wire | W1 | C,D,F | NavTabs use SVG icons |
