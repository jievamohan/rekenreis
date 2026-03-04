# Epic 11 — Audio & Micro-Animations: Solution

## 1. Profile Schema

Extend ProfilePrefs in profileSchema.ts:
```ts
soundOn: boolean  // default true
```
Update defaultPrefs() and migration (new profiles get soundOn: true).

## 2. useSound Composable

- `useSound(profile?: Ref<ProfileData | null>)`
- `playCorrect()`, `playWrong()`, `playCelebrate()`
- Lazy-load: create new Audio() on first play; store in module-level cache
- Check profile?.prefs?.soundOn ?? true before playing
- Try/catch around play(); never throw

## 3. Integration

- play.vue (or wherever usePlayGame is used): watch feedback, call useSound methods
- useRewards: when bestScore unlocks new reward, call playCelebrate()
- settings.vue: add "Sound effects" checkbox bound to profile prefs

## 4. SFX Assets

- Add 3 short MP3 files to public/sfx/ (or use data URIs / inline base64 if we want zero extra requests; prefer public for clarity)
- Name: correct.mp3, wrong.mp3, celebrate.mp3

## 5. Micro-Animations

- Create FeedbackTransition.vue or shared CSS for feedback states
- Skin components: add transition wrappers; classes feedback-correct, feedback-incorrect
- CSS keyframes: scale 1.02 for correct; translateX shake for wrong
- prefers-reduced-motion: reduce → animation: none
