# UX — Epic 26

## UX Designer Output

### Primary screens impacted
- `/map` (level map page)

### Current behavior
- Map scroll container shows full map; user may need to scroll to find current level.
- MapDecor places items in bands left/right of path; map-container has max-width 600px; decoration is constrained to path vicinity.

### Desired behavior

#### 1. Scroll-to-current on load
- On mount: scroll the `.map-scroll` container so the current level node is vertically centered (or near-center) in the viewport.
- Use `scrollIntoView` or `scrollTop` calculation with `nextTick` after DOM is ready.
- Respect reduced-motion: optional gentle scroll or instant; no jarring jump if user prefers reduced motion.

#### 2. Full-width decoration
- Decoration layer must span full viewport width (or full scroll container width), not just the path band.
- MapDecor currently lives inside `.map-container` (max-width 600px). Options:
  - Move MapDecor to a sibling of map-container that spans full width of `.map-scroll`, or
  - Make map-decor overflow/position such that it visually fills the scroll area width.
- Decoration items (seaweed, coral, shells, etc.) should be distributed across 0–100% of horizontal space.

#### 3. Dense decoration
- Increase item count (e.g. from `h/55` to `h/25` or similar).
- Ensure distribution remains visually balanced; avoid clumping.

### Component catalog
- `map.vue`: add ref for scroll container, onMounted scroll logic.
- `MapDecor.vue`: change x-distribution from path-based bands to full 0–100%; increase count; possibly move to full-width wrapper.

### Tap targets & accessibility
- No new interactive elements.
- Scroll behavior: ensure it does not cause focus loss or disorientation.
- Reduced motion: `prefers-reduced-motion: reduce` → instant scroll or skip scroll animation.
