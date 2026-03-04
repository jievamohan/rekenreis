# Epic 11 — Audio & Micro-Animations: UX

## Principles

- Optional; defaults on, easy to turn off
- Never block gameplay if audio fails (muted, unsupported)
- Animations subtle and non-punitive

## Sound

- Toggle in settings: "Sound effects" (default on)
- SFX: correct (short positive), wrong (gentle neutral), celebrate (best-score unlock)
- If AudioContext/Audio fails: fail silently; game continues

## Animations

- **Correct**: brief scale or subtle bounce (0.2–0.3s)
- **Wrong**: gentle horizontal shake (non-punitive; ~0.2s)
- **Reduced motion**: if prefers-reduced-motion: reduce, disable animations

## Settings

- Add "Sound effects" checkbox next to hints toggle
- Per profile (soundOn in ProfilePrefs)
