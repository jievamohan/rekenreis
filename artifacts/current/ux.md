# Epic 17 — Graphics v1: UX Design

## Target Users

- Kleuters (4–7 years): minimal reading, big tap targets, playful visuals
- Parents: accessible, no fail states, gentle feedback

## Interaction Model

### Build-Bridge Mode (graphical)

1. **Scene**: Bridge gap with water/ground below; character or object on one side
2. **Question**: Visual or minimal text (e.g., "3 + 2 = ?") integrated into scene
3. **Choices**: Planks/tiles as draggable game objects with numbers
4. **Correct**: Drag correct plank into gap → bridge completes → celebration
5. **Wrong**: Gentle wobble, plank returns to pool, optional hint after 2 wrong
6. **Keyboard**: Select plank (focus) → Tab to drop zone → Enter/Space to place

## Visual Hierarchy

- **Background**: Sky/ground or water; sets mood
- **Foreground**: Bridge structure (left span, gap, right span)
- **Character/object**: Small mascot or object to give context
- **Planks**: Large, tappable, visually distinct from background

## Tap Targets

- Minimum 44×44px (WCAG 2.5.5)
- Planks: large enough for small fingers
- Drop zone: generous hit area

## Feedback Cadence

- **Correct**: Short celebration (confetti/bounce), then Next
- **Wrong**: Wobble (reduced-motion: none), plank returns, no punishment
- **Hint (after 2 wrong)**: Dots or number line; gentle, non-blocking

## Mode Selector

- Big buttons with icons (🌉 for Build Bridge)
- Kid-friendly labels; minimal text
- Remember last selection (local)
