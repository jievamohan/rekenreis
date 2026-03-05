# Epic 21.3 — UX

**Source:** docs/design/epic-21.md

## Bubble Pop

- **Pattern:** tap
- **Mechanic:** Bubbles float up with numbers; tap the bubble showing the correct answer
- **Targets:** All bubbles ≥ 44px; spacing ≥ 8px
- **Keyboard:** Tab through bubbles, Enter/Space to select

## Treasure Dive

- **Pattern:** drag
- **Mechanic:** Gems/shells with numbers; drag the correct one into the chest
- **Keyboard fallback:** Select-from-list (Tab + Enter/Space) when drag unavailable
- **Targets:** Gems and chest hitbox ≥ 44px

## Layout

- Minigames render within existing GameStageCard/play layout
- ProblemCard remains canonical math display
- Fallback: if minigame fails to load, show Keypad

## Accessibility

- Focus states visible on all interactive elements
- Reduced motion: instant state change under prefers-reduced-motion
- aria-labels on game objects; decorative SVGs aria-hidden
