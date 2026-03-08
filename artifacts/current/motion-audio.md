# Motion & Audio — Epic 28: New Minigame (Replace Coral)

## Animations (Memory-Flip)

| Event | Animation | Duration |
|-------|-----------|----------|
| Card flip (reveal) | 3D flip / scale-y 0→1 | 200ms |
| Card flip (hide) | Scale-y 1→0 | 150ms |
| Match found | Glow pulse, slight scale 1.05 | 300ms |
| Wrong pair | Gentle shake, then flip back | 400ms |

## Timing / Easing

- Flip: ease-out
- Match: bounce easing
- Wrong: ease-in-out

## Reduced Motion

- Flip: instant opacity/visibility change
- No shake, no bounce
- Match: static glow, no scale

## Sound Rules

- Reuse `playCelebrate()` on correct match
- Optional: soft "flip" SFX on card turn
- Optional: gentle "wrong" cue (non-punitive) on mismatch
- Respect global sound toggle
