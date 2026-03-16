---
id: 0219-epic50-1-ipad-browser-usability
title: iPad Browser Usability
scope_in:
  - Disable double-tap zoom (viewport meta + touch-action)
  - Remove spurious scroll in minigames
  - Document/fix login cookie for iPad
scope_out: []
lanes: [W1, I]
file_globs:
  - apps/web/nuxt.config.ts
  - apps/web/app.vue
  - apps/web/pages/play.vue
  - apps/web/components/minigames/MinigameRenderer.vue
  - apps/api/.env.example
  - docs/runbooks/deploy-transip.md
gates: [C, D, F]
risk_tags: []
acceptance:
  - Viewport meta prevents double-tap zoom on iOS
  - touch-action: manipulation on body and minigame areas
  - Minigames have overflow: hidden, no spurious scroll
  - Cookie docs updated for production iPad
---

# Epic 50.1 — iPad Browser Usability
