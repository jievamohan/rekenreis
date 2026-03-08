# Epic 26.1 — Map Scroll-to-Current + Full-Width Dense Decoration

Map scroll-to-current on load + full-width dense background decoration.

## Requirements

- On map load: scroll so current level node is centered (or near-center) in viewport
- Background decoration: expand from path-width band to full page width
- Decoration density: increase to ~2–3× current (e.g. h/25 vs h/55)
- Respect prefers-reduced-motion: instant scroll when preferred
- E2E: assert current node in view after map load; decoration visible

## Tasks

- [ ] 0134-epic26-1-map-scroll-decor
