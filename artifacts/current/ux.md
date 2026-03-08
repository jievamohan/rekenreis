# UX Design — Epic 27 (UX Designer)

## Primary Screen Impacted

- `/play` — minigame rendering area (within GameStageCard)

## Current Coral Builder UX Issues

1. **Abstract interaction:** Number track with positions — feels like a form, not a game
2. **Weak visual metaphor:** Coral/reef are decorative (emoji), not core to interaction
3. **Cognitive load:** User must map "place coral" to "pick number from track" — disconnect
4. **No tactile feedback:** Tap is instant; no drag, no placement, no growth

## Desired UX (New Coral Minigame)

### Core Interaction Model

- **Primary:** User performs a concrete, satisfying action (e.g. drag coral piece onto reef, or tap to grow)
- **Feedback:** Immediate visual + optional audio feedback on correct answer
- **Wrong answer:** Gentle feedback (wobble, return) — no punishment, hint after 2 wrong

### Layout Principles

- **Scene-first:** Clear scene (reef, ocean floor) with coral pieces as game objects
- **Tap targets:** All interactive elements ≥ 44px
- **Spacing:** ≥ 8px between elements
- **Keyboard:** Tab through choices, Enter/Space to select; drag minigames need keyboard fallback (select + place)

### Flow

```
ProblemCard (a + b = ?) → Coral Scene loads → User interacts (e.g. drag/tap) → Answer submitted → Feedback
```

### Component Catalog

- **MinigameCoralBuilder.vue** (replacement): New scene, new mechanic, same props/emit contract
- **MinigameRenderer.vue:** No change; loads component by id
- **useMinigame.ts:** Same id `coral-builder`; component swap only

## Accessibility Notes

- Keyboard: Full navigation and selection without pointer
- Focus: Visible focus ring on all interactive elements
- Reduced motion: Animations degrade to instant or static
- Screen reader: aria-labels for scene and choices
