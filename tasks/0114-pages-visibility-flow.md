---
id: "0114"
title: "Update pages for visibility rules and flow wiring"
lane: W1
depends_on: ["0113"]
scope_in:
  - apps/web/pages/map.vue
  - apps/web/pages/play.vue
  - apps/web/pages/settings.vue
  - apps/web/pages/stickers.vue
  - apps/web/pages/summary.vue
scope_out:
  - composables
  - layouts
  - tests
gates: [C, D, F]
risk_tags: []
---

## Objective
Update all pages to respect the UI visibility matrix. Add missing elements (Exit to Map,
Play current CTA) and remove ad-hoc navigation that conflicts with AppShell.

## Acceptance Criteria
- [ ] Map page: has "Play current" CTA, stars total display
- [ ] Play page: has "Exit to Map" button in HUD
- [ ] Settings/Stickers/Summary: ad-hoc "Back to game" links removed (AppShell handles)
- [ ] No map-only elements leak to non-map pages
- [ ] No play-only HUD elements on non-play pages
- [ ] Typecheck passes
