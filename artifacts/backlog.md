# Epic 11 — Audio & Micro-Animations: Backlog

## Epic Summary

Add optional sound effects and micro-animations. Per-profile toggle. Never block gameplay. Respect reduced-motion.

## Scope In

- ProfilePrefs.soundOn; settings toggle
- useSound composable: correct/wrong/celebrate; lazy-load; never block
- SFX assets in public/sfx
- Feedback micro-animations (correct: subtle scale; wrong: gentle shake)
- prefers-reduced-motion support

## Scope Out

- Background music
- Heavy animation libraries

## Risks + Mitigations

| Tag | Risk | Mitigation |
|-----|------|------------|
| perf | Bundle growth | Lazy-load audio; small SFX files |

## NFRs

- Perf: lazy-load audio; bundle budget
- A11y: prefers-reduced-motion: reduce disables animations

## Task List

| # | Title | Lanes | Gates |
|---|-------|-------|-------|
| 0060 | sound-prefs-schema | W2 | C, D, F |
| 0061 | useSound-composable | W2 | C, D, F |
| 0062 | sfx-assets-settings-toggle | I, W1 | C, D, F |
| 0063 | feedback-micro-animations | W1 | C, D, F |
| 0064 | audio-animations-tests | T | C, D, F |
