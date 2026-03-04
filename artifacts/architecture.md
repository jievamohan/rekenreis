# Epic 11 — Audio & Micro-Animations: Architecture

## Storage

- **ProfilePrefs** (profileSchema.ts): add `soundOn: boolean` (default true)

## Composables

- **useSound(profile?)**: play correct/wrong/celebrate; reads soundOn from active profile; lazy-loads audio; never blocks (try/catch, no throw)
- Called from play flow when feedback changes (usePlayGame consumer) or when reward unlocks (useRewards)

## Assets

- `public/sfx/correct.mp3`, `wrong.mp3`, `celebrate.mp3` (tiny files; Web Audio or HTML5 Audio)
- Lazy: create Audio objects on first play; don't preload in critical path

## Animations

- Skin/mode feedback areas: wrap in `<Transition name="feedback">` or use CSS classes
- CSS: `.feedback-correct` scale; `.feedback-incorrect` shake
- `@media (prefers-reduced-motion: reduce)` disables transitions/transforms

## Flow

1. Play → feedback set → useSound plays (if soundOn) → skin shows animation (if not reduced-motion)
2. Settings → sound toggle → profile.updateProfile(prefs: { soundOn })
