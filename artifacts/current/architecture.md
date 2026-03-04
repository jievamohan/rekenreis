# Epic 19 — Architecture Notes (Principal Architect)

## Where Tokens Live

- `apps/web/assets/css/tokens.css` — primary design tokens
- `apps/web/assets/css/graphics.css` — graphics-specific tokens (build-bridge, etc.)

Epic 19 updates both for underwater palette. Consider adding `--theme-*` namespace if we ever support theme switching.

## Where Shell Lives

- `apps/web/layouts/default.vue` — wraps with AppShell
- `apps/web/components/AppShell.vue` — top bar, stage, nav
- `apps/web/components/GameStageCard.vue` — content card
- `apps/web/components/NavTabs.vue` — bottom nav

## Component Folder Structure

```
apps/web/
  assets/
    css/
      tokens.css
      graphics.css
    graphics/
      backgrounds/     # Add underwater patterns
      objects/         # Add underwater objects (fish, bubbles, etc.)
      icons/           # New: nav icons (fish, chart, gear)
  components/
    AppShell.vue
    GameStageCard.vue
    NavTabs.vue
    ...
```

## Asset Pipeline Rules

- SVGs: inline or `~/assets/` import
- Background patterns: CSS `background-image` or SVG
- Size budget: keep total graphics reasonable (< 50KB for new assets)

## Performance Constraints

- Bundle size budget must pass (Gate F)
- Lazy-load non-critical assets if needed
