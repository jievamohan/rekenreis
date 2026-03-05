# Motion & Audio Design — Epic 21

**Role:** motion-audio-designer  
**Epic:** 21 — Six New Minigames  
**Constraint:** CSS/SVG only, no game engines

---

## Animation Specs per Minigame

### Bubble Pop
- **Bubbles floating up:** CSS `translateY` animation, continuous upward drift (loop)
- **Pop animation:** On tap — scale 1 → 1.2 + opacity 1 → 0, collapse to nothing
- **Timing:** float ~2–3s loop; pop ≤300ms

### Treasure Dive
- **Gem/shell drag feedback:** Slight scale-up (1.05) on drag start, return on drop
- **Chest open/close:** Transform rotateX or scale on lid; open state, close state
- **Timing:** drag feedback ≤200ms; chest open/close ≤300ms

### Fish Feed
- **Pellet drop animation:** translateY from top to fish mouth, arc optional
- **Fish eat animation:** Brief scale pulse (1 → 1.1 → 1) on successful feed
- **Timing:** drop ~400ms; eat pulse ≤300ms

### Coral Builder
- **Coral piece place animation:** Scale 0 → 1.1 → 1 (bounce), opacity 0 → 1
- **Timing:** ≤300ms

### Submarine Sort
- **Item slide into compartment:** translateX/translateY to target slot, then snap
- **Timing:** slide ≤300ms

### Starfish Match
- **Match glow:** Box-shadow or filter brightness pulse on correct pair
- **Pair connection line:** stroke-dasharray draw-in (similar to map path)
- **Timing:** glow ≤300ms; line draw ≤400ms

---

## Timing & Easing

| Animation Type | Max Duration | Easing |
|----------------|--------------|--------|
| All micro-interactions | ≤300ms | ease-out or cubic-bezier(0.25, 0.1, 0.25, 1) |
| Continuous loops (bubbles) | 2–3s | linear or ease-in-out |
| Draw-in (lines) | ≤400ms | ease-out |

---

## Reduced Motion

- **Rule:** `prefers-reduced-motion: reduce` must be respected everywhere
- **Behavior:** All animations collapse to instant state change; no motion
- **Implementation:** Wrap all animated properties in `@media (prefers-reduced-motion: no-preference)` or use `transition: none` when reduced
- **Fallback:** Elements appear in final state immediately; no floating, sliding, or scaling

---

## Sound Rules

- **Reuse existing:** correct, wrong, celebrate SFX via `useSound`
- **Optional placement sound:** Gentle "plop" for placement actions (coral place, item drop, etc.)
- **No new audio files required** in initial implementation — reuse existing assets
- **Mapping:** correct → correct answer; wrong → incorrect; celebrate → level/minigame complete

---

## CSS-Only Constraint

- All animations via `@keyframes` or `transition`
- No JS animation libraries (no GSAP, Framer Motion, etc.)
- State changes driven by class toggles or data attributes; CSS handles visual motion
