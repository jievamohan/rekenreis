# Epic 19 — Motion & Audio Rules (Motion/Audio Designer)

## Animations List

- Existing: button hover, focus, feedback bounce/shake
- No new animations required for Epic 19
- If any new micro-animations (e.g. bubble float): must respect `prefers-reduced-motion`

## Timing / Easing

- Keep `--app-transition: 0.2s ease`
- Reduced motion: `--app-transition: 0s` (already in tokens.css)

## Reduced Motion Behavior

- **Mandatory**: All transitions respect `@media (prefers-reduced-motion: reduce)`
- No parallax or floating animations that cannot be disabled
- If background patterns animate: provide static fallback

## Sound Rules

- No changes; existing sound toggles and SFX remain
