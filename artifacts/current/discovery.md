# Epic 18 — Discovery

## Feature Summary

**Global Kid-Friendly Look & Feel v2 (Remove White, Unify Whole App)**

Transform the entire app (not just the minigame) into a playful kindergarten-friendly look-and-feel. Make every page feel like a game by removing the "white document" look and unifying layout, typography, navigation, and feedback across the whole app.

## Current State

- **app.vue**: Bare wrapper, no layout; just `<NuxtPage />`
- **Pages**: index, start, play, stickers, summary, settings — each with ad-hoc styles, `font-family: system-ui`, plain white backgrounds, inconsistent nav
- **play.vue**: Has its own nav (Choose game, skin picker, profile, daily goal), footer; no shared shell
- **graphics.css**: Epic 17 tokens for minigame only (sky, ground, water, plank, etc.)
- **SceneLayout.vue**: Minigame scene wrapper; not a global layout
- **No Tailwind** in web app; pure CSS + scoped styles

## Key Pages to Transform

| Page | Route | Current Look |
|------|-------|--------------|
| Home | / | White, system-ui, nav links |
| Start | /start | White, JSON health display |
| Play | /play | White, game area, skin picker, footer |
| Stickers | /stickers | White, sticker grid |
| Summary | /summary | White, metrics grid, export buttons |
| Settings | /settings | White, form fields |

## Constraints

- No backend changes
- No new game modes or logic
- Use simple patterns/gradients/icons (no high-fidelity art packs)
- Contrast + reduced-motion compliance must be preserved
- Minigame styling must integrate into new shell (no "styled island")
