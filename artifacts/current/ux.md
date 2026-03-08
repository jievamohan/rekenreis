# UX Design — Epic 28: New Minigame (Replace Coral)

## Primary Screens Impacted

- `/play` — minigame area within the play flow

## Layout Diversity Requirement

**Current pattern (all minigames):**
- Progress bar at top
- ProblemCard (a + b = ?) below
- Minigame area with answer choices/objects

**Target for new minigame:**
- Break the visual monotony. Options:
  1. **Embedded problem:** The sum is woven into the game narrative (e.g. "Find the two shells that add up to 5") — no separate ProblemCard dominance
  2. **Full-bleed scene:** Minigame occupies more vertical space; problem is subtle or integrated
  3. **Different composition:** e.g. grid of cards, number line, or path — not "row of answer buttons"

## Component Catalog

- **New component:** Replaces MinigameCoralBuilder.vue (e.g. MinigameMemoryMatch.vue or MinigameNumberLineLeap.vue)
- **MinigameRenderer:** Unchanged; loads new component by id
- **useMinigame:** coral-builder id replaced or repurposed; new definition registered
- **play.vue:** May support optional "layout variant" for minigames that request different shell treatment (e.g. hide ProblemCard for immersive games) — if justified

## Tap Targets & Accessibility

- All interactive elements ≥ 44px
- Keyboard: Tab through options, Enter/Space to select
- Focus states visible
- Reduced motion: animations degrade to instant

## Navigation Model

- Same as current: map → play → minigame round → feedback → next round
- No new routes or modals
