# Epic 18 — Solution

## 1. Design Tokens

Create `apps/web/assets/css/tokens.css` (or merge into graphics.css):

- `--app-bg`: gradient or soft pattern background
- `--app-surface`: card/surface color
- `--app-primary`, `--app-secondary`
- `--app-correct`, `--app-wrong`, `--app-muted`
- `--app-font`: kid-friendly, rounded (e.g. Nunito, Quicksand, or system fallback)
- `--app-radius`, `--app-spacing`, `--app-shadow`
- Button/tile utility classes

Import in nuxt.config or app.vue.

## 2. AppShell Component

- `apps/web/components/AppShell.vue` or `layouts/default.vue`
- Props/slots: default slot for page content
- Structure: background div, top bar, main area, nav tabs
- Top bar: profile pill, Choose game button
- Nav: Sticker book, Progress, Settings (icon + label)

## 3. Shared Components

- `NavTabs.vue`: Icon + label tabs, min 44×44px
- `PrimaryButton.vue`, `SecondaryButton.vue`
- `StatPill.vue`: score/streak/rounds
- `GameStageCard.vue`: Wraps minigame/content with rounded corners, shadow

## 4. Layout Integration

- Create `layouts/default.vue` with AppShell
- Set as default layout for all pages
- Wrap page content in GameStageCard where appropriate

## 5. Page Migration

- index, start, play, stickers, summary, settings: use default layout
- Replace ad-hoc styles with token-based classes
- Ensure no plain white backgrounds

## 6. Minigame Integration

- Play page: game area inside GameStageCard
- SceneLayout (build-bridge) remains; fits inside stage card
- No "styled island" — visual continuity with shell
