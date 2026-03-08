# Motion & Audio — Epic 27 (Motion/Audio Designer)

## Animations (New Coral Minigame)

| Event | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Coral piece hover | Slight scale-up (1.05) | 150ms | ease-out |
| Coral piece drag start | Scale 1.05, slight lift (translateY -4px) | 150ms | ease-out |
| Correct drop | Snap into slot, reef glow pulse | 300ms | cubic-bezier(0.34, 1.56, 0.64, 1) |
| Wrong drop | Wobble (rotate -3° → 3° → 0°), return to tray | 400ms | ease-out |
| Hint reveal | Fade-in target highlight | 200ms | ease-out |

## Timing Rules

- All animations ≤ 400ms
- No looping animations that distract (optional: very subtle coral "breathe" at 3s — low priority)
- Reduced motion: disable or shorten; wrong-drop returns instantly

## Audio

- **Correct:** Reuse `playCelebrate()` or coral-specific soft "pop" if available
- **Wrong:** Reuse gentle wrong SFX (non-punitive)
- **Place:** Optional soft "thunk" on correct drop — satisfying tactile cue
- Respect global audio toggle and reduced-motion

## Reduced Motion

- `prefers-reduced-motion: reduce` → no scale/lift on drag; instant state changes
- Wrong piece: instant return, no wobble
- Correct: instant placement, no bounce
