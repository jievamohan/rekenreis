# Solution — Epic 26

## Solution Designer Output

### Implementation notes

#### Task 1: Scroll-to-current on map load
- In `map.vue`:
  - Add `mapScrollRef` for `.map-scroll`
  - Add `currentNodeRef` (or use data attribute + querySelector) for the current level node wrapper
  - In `onMounted` + `nextTick`: call `currentNodeRef.value?.scrollIntoView({ block: 'center', behavior: prefersReducedMotion ? 'auto' : 'smooth' })`
  - Or: compute `scrollTop = nodeOffsetTop - (scrollHeight/2) + (nodeHeight/2)` and set on scroll container
- Reduced motion: use `window.matchMedia('(prefers-reduced-motion: reduce)')` to choose instant vs smooth.

#### Task 2: Full-width + dense decoration
- In `MapDecor.vue`:
  - Remove path-based x distribution. Use `xPct = rng() * 100` (full 0–100%) or similar.
  - Ensure MapDecor container spans full width. If MapDecor is inside map-container (600px), it will only fill that. **Solution:** Move MapDecor to a full-width wrapper inside map-scroll, or make map-scroll's first child a full-width div that contains MapDecor, and map-container is a sibling or overlay.
- Layout: `.map-scroll` contains:
  1. Full-width div (position absolute, inset 0, width 100%) with MapDecor — fills scroll area
  2. map-container (centered, max-width 600px) with path, nodes, avatar
- MapDecor: change `count` from `Math.floor(h/55)` to `Math.floor(h/25)` or `h/20` for density.
- Pass `mapHeight` and optionally `containerWidth` if we need to match scroll width.

### Files to modify
- `apps/web/pages/map.vue`: scroll logic, possibly restructure template for full-width decor
- `apps/web/components/map/MapDecor.vue`: full-width x distribution, increased count
