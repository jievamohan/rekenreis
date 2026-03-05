# Epic 21.3 — Motion & Audio

**Source:** docs/design/epic-21.md

## Animations

- **Bubble Pop:** Float (translateY loop 2–3s), pop (scale+opacity ≤ 300ms)
- **Treasure Dive:** Drag scale-up (1.05, ≤ 200ms), chest open/close (≤ 300ms)
- All via CSS `@keyframes` or `transition`; no JS libraries

## Reduced Motion

- Under `prefers-reduced-motion: reduce`: instant state change
- Use `@media (prefers-reduced-motion: no-preference)` or `--app-transition: 0s` override

## Audio

- Reuse existing: correct, wrong, celebrate SFX via `useSound`
- No new audio files for v1
