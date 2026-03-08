# Architecture — Epic 26

## Principal Architect Output

### Scope
- Map page (`pages/map.vue`) and MapDecor component (`components/map/MapDecor.vue`).

### Layout structure
- `map.vue`: `.map-page` > `.map-header` + `.play-current-cta` + `.map-scroll`
- `.map-scroll`: scrollable; contains `.map-container` (max-width 600px, centered)
- `.map-container`: MapDecor, MapPath, nodes, avatar

### Key decisions

#### 1. Decoration full-width
- Option A: MapDecor stays inside map-container but uses `position: fixed` or viewport-relative width — rejected (breaks scroll context).
- Option B: Add a full-width decoration layer as sibling to map-container, inside map-scroll. MapDecor receives `containerWidth` or uses `100vw` / `100%` of scroll container. **Preferred.**
- Option C: MapDecor moves to a wrapper that spans full width of map-scroll; map-container remains centered for path/nodes. **Preferred** — clean separation.

#### 2. Scroll-to-current
- Use `scrollIntoView({ block: 'center' })` on current node wrapper, or compute `scrollTop` from node offset.
- Requires ref to scroll container and ref/template ref to current node.
- Run in `onMounted` + `nextTick` to ensure layout complete.

### Component folder structure
- No new components. Modify: `pages/map.vue`, `components/map/MapDecor.vue`.

### Performance constraints
- More decoration items: ensure no layout thrash. Use `will-change: transform` (already present). Count increase is modest (2–3×).
