# Epic 21.3 — Solution

**Source:** docs/design/epic-21.md

## Implementation Order

1. **BubblePop component** — Vue component, props: question, onAnswer; floating bubbles, tap handler
2. **TreasureDive component** — Vue component, props: question, onAnswer; drag gem to chest, keyboard fallback
3. **SVG placeholders** — Simple geometric shapes < 2KB each in assets/graphics/minigames/
4. **play.vue integration** — Wire MinigameRenderer; ensure serving picks bubble-pop or treasure-dive
5. **Tests** — Unit: props/onAnswer; E2E: play round with each minigame

## Technical Notes

- No duplicated math logic; minigames are interaction wrappers only
- CSS transitions only; no JS animation libraries
- Deterministic seed for reproducible minigame sequence in tests
