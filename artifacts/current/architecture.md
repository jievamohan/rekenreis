# Architecture — Epic 21.4

**Source:** docs/design/epic-21.md

## Components

- `MinigameFishFeed.vue` — timed scene, pellet tap
- `MinigameCoralBuilder.vue` — scene/tap, coral piece tap

## Pattern

- Reuse AdditionQuestion + onAnswer pattern (same as Bubble Pop, Treasure Dive)
- MinigameRenderer resolves component via useMinigame
- Minigame receives question + onAnswer, calls onAnswer(choice) on user action

## Location

- `apps/web/components/minigames/`
- Assets: `apps/web/assets/graphics/minigames/fish-feed/`, `coral-builder/`
