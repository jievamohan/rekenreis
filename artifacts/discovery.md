# Epic 11 — Audio & Micro-Animations: Discovery

## Feature Summary

Add optional sound effects (correct, wrong, celebrate) and micro-animations (subtle motion on correct, gentle shake on wrong). Global toggle per profile. Never block gameplay. Respect reduced-motion preference.

## Current State

- **Audio**: None; no audio/Sound/AudioContext usage
- **Animations**: Minimal — ParentGate hold-fill transition; no feedback animations
- **Feedback flow**: usePlayGame sets `feedback` (correct/incorrect/timeout); skin components render it
- **Profile prefs**: ProfilePrefs has lastMode, lastSkin, difficultyCeiling, hintsOn; no soundOn
- **Settings**: settings.vue behind ParentGate; difficulty + hints toggles

## Requirements (from Epic)

1. **Sound**: tiny SFX pack (correct, wrong, celebrate); global toggle per profile; never block if audio fails
2. **Animations**: subtle motion on correct; gentle shake on wrong (non-punitive)
3. **Performance**: lazy-load audio; bundle within budget
4. **Accessibility**: respect prefers-reduced-motion
5. **Tests**: settings persistence; reduced-motion behavior

## Non-goals

- Background music
- Heavy animation libraries

## Key Files

- `apps/web/utils/profileSchema.ts` — add soundOn to ProfilePrefs
- `apps/web/composables/useSound.ts` — new: play SFX, lazy-load, never block
- `apps/web/composables/usePlayGame.ts` — feedback triggers; wire to useSound
- `apps/web/pages/settings.vue` — add sound toggle
- `apps/web/public/` — SFX files (correct, wrong, celebrate)
- Skin/mode components — add transition/animation wrappers; prefers-reduced-motion
