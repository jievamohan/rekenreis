---
id: "0134"
title: "epic26-1-map-scroll-decor"
status: "done"
scope_in:
  - "apps/web/pages/map.vue"
  - "apps/web/components/map/MapDecor.vue"
  - "apps/web/e2e/"
scope_out:
  - "apps/api"
  - "new assets"
lanes: ["W1", "T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "On map load, current level node is centered (or near-center) in viewport"
  - "Decoration spans full page width"
  - "Decoration density is 2–3× current (noticeably denser)"
  - "Reduced motion: scroll is instant when preferred"
  - "E2E: map loads, current node in view, decoration visible"
  - "Typecheck, build, smoke green"
---

# Epic 26.1 — Map Scroll-to-Current + Full-Width Dense Decoration

## Goal

Map scroll-to-current on load + full-width dense background decoration.

## Implementation

1. **map.vue**: Add scroll-to-current on mount
   - Use `scrollIntoView({ block: 'center' })` or scrollTop calculation
   - Respect `prefers-reduced-motion`: instant scroll when preferred
   - Add refs for map-scroll and current node

2. **MapDecor.vue**: Full-width + dense decoration
   - Remove path-based x distribution; use `xPct = rng() * 100` (full 0–100%)
   - Move MapDecor to full-width wrapper inside map-scroll
   - Change count from `Math.floor(h/55)` to `Math.floor(h/25)` or `h/20`

3. **E2E**: Add assertions
   - Current level node in view after map load
   - Decoration elements visible
