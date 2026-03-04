# Epic 18 — Backlog

## Epic Summary

**Global Kid-Friendly Look & Feel v2**: Transform the entire app into a playful kindergarten-friendly look. Remove white document look; unify layout, typography, navigation, and feedback.

## Scope In

- App shell (global layout): playful background, centered stage card, top bar (profile pill, Choose game), nav as big icon-tabs
- Design tokens: colors, typography, radii, spacing, shadows, button/tile styles
- Shared components: AppShell, NavTabs, PrimaryButton, SecondaryButton, StatPill, GameStageCard
- Migrate all pages (play, stickers, progress, settings, start, index) to use shell + tokens
- Visual criteria: no plain white, big buttons, 44×44px tap targets, consistent typography, contrast + reduced-motion
- Minigame integrates into shell (no styled island)
- E2E smoke updated; UI regression assertion for AppShell/nav/stage

## Scope Out

- New game modes or logic changes
- High-fidelity artwork packs
- Backend changes

## Risks + Mitigations

| Risk | Tag | Mitigation |
|------|-----|------------|
| Bundle size | perf | Tokens + CSS only; no heavy art |
| A11y regression | security | Audit contrast, reduced-motion |
| Layout breakage | - | Smoke + manual verification |

No high-risk tags: auth, payments, crypto, data-loss, privacy.

## NFRs

- **Perf**: Bundle budget must pass
- **Security**: No new secrets; semgrep clean
- **A11y**: Contrast, reduced-motion, tap targets

## Task List

| # | Title | Lanes | Gates | Risk |
|---|-------|-------|-------|------|
| 1 | design-tokens | W1 | C,D,F | perf |
| 2 | app-shell-layout | W1 | C,D,F | - |
| 3 | shared-components | W1 | C,D,F | - |
| 4 | page-migration | W1 | C,D,F | - |
| 5 | smoke-ui-regression | T | C,D,F | - |

## Task Details

### Task 1: design-tokens
- Define CSS variables (colors, typography, radii, spacing, shadows)
- Replace ad-hoc styles with tokens
- Lanes: W1 (apps/web/assets/css/*, nuxt.config)
- Gates: C, D, F

### Task 2: app-shell-layout
- Create AppShell / default layout
- Playful background, stage card, top bar, nav
- Lanes: W1 (layouts, components)
- Gates: C, D, F

### Task 3: shared-components
- NavTabs, PrimaryButton, SecondaryButton, StatPill, GameStageCard
- Lanes: W1 (components)
- Gates: C, D, F

### Task 4: page-migration
- Migrate index, start, play, stickers, summary, settings to shell + tokens
- Lanes: W1 (pages)
- Gates: C, D, F

### Task 5: smoke-ui-regression
- E2E smoke updated; UI regression: AppShell renders nav tabs and stage
- Lanes: T (tests, docs/runbooks)
- Gates: C, D, F
