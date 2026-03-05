# Motion & Audio — Epic 21.4

**Source:** docs/design/epic-21.md

## Animations

- CSS transitions only; no JS animation libraries
- Fish Feed: pellet drop translateY, eat pulse
- Coral Builder: piece place scale bounce

## Reduced Motion

- All animations collapse to instant under `prefers-reduced-motion: reduce`
- Use @media (prefers-reduced-motion: no-preference) or --app-transition: 0s override

## Audio

- Reuse existing correct, wrong, celebrate SFX via useSound
- No new audio files required
