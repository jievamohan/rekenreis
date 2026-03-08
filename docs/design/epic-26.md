# Epic 26 Design Bible — Map Scroll-to-Current + Full-Width Dense Decoration

> PlanRef (master): artifacts/archive/epic-26.0/latest
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Kleuters (kindergarten-age children) and their parents using the Rekenreis app.

**Primary experience goal:**
- Improve map page usability: user immediately sees their current level without manual scrolling.
- Improve visual richness: full-width underwater decoration creates a more immersive, playful atmosphere.

**"Looks/feels like" acceptance criteria:**
1. On map load: current level node is centered (or near-center) in the viewport.
2. Background decoration spans full page width (not constrained to path band).
3. Decoration density is noticeably increased ("lekker dense").

**Non-goals:**
- New minigames or gameplay changes.
- New assets or illustrations (reuse existing underwater SVGs).
- Changes to path drawing or node behavior.

---

## 2. Visual Direction (Art Director)

**Theme directive:** Maintain underwater theme. Decoration expansion is about coverage and density, not style change.

**Color palette:** No change. Existing underwater tokens and SVG assets remain.

**Background patterns:**
- Current: MapDecor places items in bands around the path; map-container constrains width.
- New: Full-width coverage. Items distributed across entire horizontal viewport.
- Density: "lekker dense" — more items per vertical unit. Target: 2–3× current density (e.g. h/25 vs h/55).

**Do:** Spread decoration evenly left-to-right. Keep opacity/scale variation for depth. Preserve underwater palette and asset style.

**Don't:** Don't introduce new assets. Don't overcrowd nodes (avoid obscuring interactive elements). Don't change path or node visuals.

---

## 3. UX Layout & Components (UX Designer)

**Primary screens impacted:** `/map` (level map page).

**Current behavior:**
- Map scroll container shows full map; user may need to scroll to find current level.
- MapDecor places items in bands left/right of path; decoration constrained to path vicinity.

**Desired behavior:**

1. **Scroll-to-current on load:** On mount, scroll `.map-scroll` so the current level node is vertically centered in the viewport. Use `scrollIntoView` or `scrollTop` calculation. Respect reduced-motion: instant scroll if preferred.

2. **Full-width decoration:** Decoration layer spans full viewport/scroll container width. Items distributed across 0–100% horizontal space.

3. **Dense decoration:** Increase item count (e.g. h/25 vs h/55). Ensure balanced distribution.

**Component catalog:** Modify `map.vue` (scroll logic), `MapDecor.vue` (full-width x distribution, increased count).

---

## 4. Motion & Audio Rules (Motion/Audio)

**N/A:** No new animations or audio. Scroll-to-current may use instant or short-duration scroll. Verify reduced-motion disables scroll animation if added.

---

## 5. Accessibility (UX + QA)

- Scroll behavior: ensure it does not cause focus loss or disorientation.
- Reduced motion: `prefers-reduced-motion: reduce` → instant scroll or skip scroll animation.
- No new interactive elements; existing tap targets unchanged.

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Layout structure:**
- `.map-scroll` contains: (1) full-width decoration layer with MapDecor, (2) map-container (centered, max-width 600px) with path, nodes, avatar.

**Scroll-to-current:**
- Add `mapScrollRef` and `currentNodeRef` in map.vue.
- In `onMounted` + `nextTick`: `currentNodeRef.value?.scrollIntoView({ block: 'center', behavior: prefersReducedMotion ? 'auto' : 'smooth' })`.
- Use `window.matchMedia('(prefers-reduced-motion: reduce)')` for behavior choice.

**Full-width + dense decoration:**
- MapDecor: remove path-based x distribution. Use `xPct = rng() * 100` (full 0–100%).
- Move MapDecor to full-width wrapper inside map-scroll (sibling or overlay to map-container).
- Change count from `Math.floor(h/55)` to `Math.floor(h/25)` or `h/20`.

**Files to modify:** `apps/web/pages/map.vue`, `apps/web/components/map/MapDecor.vue`.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Unit tests:** Optional for MapDecor item count and x-range if logic extracted.

**E2E smoke updates:** Add assertion that after navigating to /map, current level node is in view. Add assertion that decoration elements exist and are distributed.

**Visual regression:** Update map page screenshot baseline if visual change is significant.

---

## 8. Security/Privacy Notes (Security/Privacy)

**New risks:** None. No new inputs, auth, data handling, or external requests.

---

## 9. Slice Map (Orchestrator)

### Epic 26.1 — Map Scroll-to-Current + Full-Width Dense Decoration

**Visual milestone:** Map loads with current level centered; decoration fills full width and is denser.

**Files/modules:** `pages/map.vue`, `components/map/MapDecor.vue`, `e2e/map.spec.ts` (or equivalent).

**Acceptance:**
- On map load, current level node is centered (or near-center) in viewport.
- Decoration spans full page width.
- Decoration density is 2–3× current (noticeably denser).
- Reduced motion: scroll is instant when preferred.
- E2E: map loads, current node in view, decoration visible.
- Typecheck, build, smoke green.
