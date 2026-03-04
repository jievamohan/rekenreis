# Epic 18 — Architecture

## Layering

```
app.vue
  └── AppShell (new global layout)
        ├── TopBar (profile pill, Choose game)
        ├── Main content slot (NuxtPage wrapped in GameStageCard or equivalent)
        └── NavTabs (Sticker book, Progress, Settings)
```

## Design Tokens (Single Source of Truth)

- **Location**: `apps/web/assets/css/tokens.css` (or extend `graphics.css`)
- **Variables**:
  - Colors: bg, surface, primary, secondary, correct, wrong, muted
  - Typography: font-family, scale (large, rounded)
  - Radii, spacing, shadows
  - Button + tile styles

## Component Hierarchy

- **AppShell**: Wraps all pages; provides background, top bar, nav
- **LayoutFrame / GameStageCard**: Wraps page content in "stage" card
- **NavTabs**: Shared bottom/top nav
- **PrimaryButton / SecondaryButton**: Shared button components
- **StatPill**: Shared stat display

## Page Integration

- Each page uses default layout (AppShell) via Nuxt layout
- Pages opt into `GameStageCard` wrapper for content
- Play page: game area inside stage card; existing minigame components unchanged

## Lane Ownership

- W1: layouts, pages, components (UI surface)
- W2: composables if needed for layout state
- T: tests, smoke, UI regression
