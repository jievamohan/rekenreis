# Discovery — Epic 27 (Business Analyst)

## Intent (User)

De minigame "plaats het koraal op de juiste plek" heeft een rare gameplay en look and feel. Verzin een betere spel, en laat het aanvoelen als een echte kinderspel. Het hoeft niet op de andere spellen te lijken.

## Problem Statement

The Coral Builder minigame ("plaats het koraal op de juiste plek") currently:
- Presents a number track (0..max) with selectable positions
- User taps a number from choices — effectively a disguised multiple-choice
- No genuine coral-building, reef scene, or tactile interaction
- Feels abstract and "form-like" rather than playful
- Does not match the promise of its name or underwater theme

## Target Audience

- Kleuters (4–6 jaar) and their parents
- Dutch-speaking (Netherlands/Flanders)
- Same audience as existing Rekenreis minigames

## Success Criteria

1. **Gameplay:** The new coral minigame must feel like a real kids' game — tactile, satisfying, with clear cause-and-effect.
2. **Distinct identity:** It does not need to resemble other minigames; it can have its own mechanic and look.
3. **Math integrity:** Still receives `AdditionQuestion` + `onAnswer`; no change to core math loop.
4. **Accessibility:** Keyboard-playable, reduced-motion support, 44px tap targets.

## Non-Goals

- Changing other minigames
- New math operators or question types
- Backend or API changes
- i18n beyond Dutch

## Impact

- **Scope:** Single minigame component (MinigameCoralBuilder.vue) replacement
- **Risk:** Low — isolated to one minigame; fallback to Keypad remains
- **Dependencies:** Existing assets (underwater SVGs), useMinigame registry, MinigameRenderer
