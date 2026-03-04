# Epic 19 — UX Layout & Components (UX Designer)

## Primary Screens Impacted

- `/` (index)
- `/start`
- `/play`
- `/stickers`
- `/summary`
- `/settings`

All pages use the default layout with AppShell.

## Global Shell Structure

- **Top bar**: Profile pill + Choose game (keep structure; restyle for underwater)
- **Main stage**: GameStageCard (replace white surface with themed surface)
- **Bottom nav**: NavTabs (replace emoji icons with underwater SVG icons)

## Navigation Model

- Same routes; no structural change
- Nav items: Sticker book, Progress, Settings
- Icons: SVG-based (fish, chart/bubbles, gear/coral) instead of emoji

## Component Catalog

| Component | Change |
|-----------|--------|
| AppShell | Underwater background, themed top bar |
| GameStageCard | Non-white surface (glass/bubble effect or gradient) |
| NavTabs | SVG icons, themed active state |
| PrimaryButton / SecondaryButton | Use new tokens |
| StatPill | Themed |
| ProfileSelector overlay | Themed |
| PlayModeSelector | Themed |
| Skin picker (play page) | Themed |

## Tap Targets & Accessibility Notes

- Keep `--app-tap-min: 44px`
- Focus states: visible outline (2px solid)
- Skip link: keep for play page
- Keyboard: no structural changes; ensure focus order preserved
