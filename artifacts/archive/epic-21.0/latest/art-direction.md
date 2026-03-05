# Epic 21: Art Direction (Art Director)

**Epic:** Minigame expansion + Dutch UI copy  
**Artifact:** art-direction.md  
**Author:** art-director

---

## 1. Underwater Theme Extension

All six minigames extend the existing underwater visual theme. Maintain:

- **Background:** Same gradient (`--app-bg`, `--app-bg-fallback`) or subtle variants (e.g. deeper blue for "dive" scenes).
- **Surfaces:** `--app-surface`, `--app-surface-elevated` for cards and panels.
- **Accents:** `--app-primary`, `--app-secondary` for interactive elements.
- **Feedback:** `--app-correct` (green), `--app-wrong` (coral/orange) — use sparingly, never harsh.
- **Existing assets:** Reuse `bubble-pattern.svg`, `wave-overlay.svg`, `bubbles.svg`, `coral.svg`, `fish-small.svg`, `starfish.svg`, `shell.svg` where applicable.

---

## 2. Asset Requirements Per Minigame

### Bubble Pop

| Asset | Description | Format | Budget |
|-------|-------------|--------|--------|
| `bubble-float.svg` | Single bubble (reusable, can tint) | SVG | < 0.5 KB |
| `bubble-pop.svg` | Pop burst (optional; CSS scale+opacity can suffice) | SVG | < 0.5 KB |
| Number labels | Inline text/CSS; no asset | — | — |

**Placeholder:** Use existing `bubbles.svg` or a simple circle with gradient fill. Numbers rendered as text overlay.

---

### Treasure Dive

| Asset | Description | Format | Budget |
|-------|-------------|--------|--------|
| `gem.svg` | Gem/crystal (1–2 variants) | SVG | < 1 KB |
| `shell-treasure.svg` | Shell with sparkle | SVG | < 1 KB |
| `chest.svg` | Treasure chest (drop target) | SVG | < 1.5 KB |

**Placeholder:** Simple geometric shapes (diamond, oval, box) with fill. Can extend `shell.svg` from assets.

---

### Fish Feed

| Asset | Description | Format | Budget |
|-------|-------------|--------|--------|
| `fish-character.svg` | Friendly fish (mascot-style) | SVG | < 1.5 KB |
| `pellet.svg` | Food pellet (small circle/dot) | SVG | < 0.3 KB |
| `bowl.svg` | Fish bowl / tank base | SVG | < 1 KB |

**Placeholder:** Use `fish-large.svg` or `fish-small.svg`; pellet = filled circle; bowl = semicircle + line.

---

### Coral Builder

| Asset | Description | Format | Budget |
|-------|-------------|--------|--------|
| `coral-piece-1.svg` … `coral-piece-3.svg` | 3 distinct coral segments | SVG | < 1 KB each |
| `reef-base.svg` | Horizontal reef/platform | SVG | < 1 KB |

**Placeholder:** Extend `coral.svg`; create 3 simple variants (branch, lump, fan). Reef = rounded rectangle.

---

### Submarine Sort

| Asset | Description | Format | Budget |
|-------|-------------|--------|--------|
| `submarine.svg` | Submarine body with compartments | SVG | < 2 KB |
| `compartment-divider.svg` | Optional; can be part of submarine | SVG | — |
| Sortable items | Reuse bubbles, gems, or simple shapes | — | — |

**Placeholder:** Rectangle with rounded front, 2–3 internal sections. Items = circles with numbers.

---

### Starfish Match

| Asset | Description | Format | Budget |
|-------|-------------|--------|--------|
| `starfish-card.svg` | Starfish (face-up state) | SVG | < 1 KB |
| `starfish-back.svg` | Card back (optional; can use same with flip) | SVG | < 0.5 KB |
| Matching indicator | CSS highlight/border | — | — |

**Placeholder:** Use existing `starfish.svg`; duplicate for pairs. Card flip via CSS transform.

---

## 3. Color Palette Extensions

Stay within existing tokens. If new accents are needed:

| Token | Use |
|-------|-----|
| `--app-primary` | Primary actions, correct highlights |
| `--app-secondary` | Secondary elements, hover states |
| `--app-muted` | Disabled, backgrounds |
| `--app-correct` | Success (subtle) |
| `--app-wrong` | Error (subtle) |

**Optional extensions** (add to `tokens.css` only if justified):

- `--app-gem`: `#b39ddb` (light purple) for gems
- `--app-coral-accent`: `#ff8a65` (existing wrong, use sparingly for coral pieces)

Prefer reusing existing palette. No new tokens unless UX requires distinct semantic color.

---

## 4. Animation Style Guidelines

- **CSS-only:** No JS-driven animation libraries. Use `transition`, `animation`, `@keyframes`.
- **Lightweight:** Prefer `transform` and `opacity`; avoid `width`/`height` animations.
- **Easing:** Use `--app-ease-micro`, `--app-ease-enter`, `--app-ease-celebrate` from tokens.
- **Duration:** 0.1–0.3s for micro; 0.25–0.5s for enter/exit; max 1s for celebrations.
- **Reduced motion:** All animations MUST respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Or use the existing `:root { --app-transition: 0s }` override. Ensure no animation runs for users who prefer reduced motion.

---

## 5. Asset Budget

| Constraint | Limit |
|------------|-------|
| Per SVG | < 2 KB |
| Total new assets (6 minigames) | < 80 KB |
| Inline SVG | Prefer for tiny icons (< 0.5 KB) |

Optimize SVGs: remove metadata, collapse paths, avoid embedded bitmaps.

---

## 6. Background / Scene Compositions

- **Bubble Pop:** Same app background; bubbles float over gradient. Optional: light bubble pattern in background.
- **Treasure Dive:** Slightly darker gradient (add `rgba(0,0,0,0.1)` overlay); seabed line at bottom.
- **Fish Feed:** Standard gradient; bowl centered; pellets below.
- **Coral Builder:** Reef at bottom 20%; coral pieces in a "source" area above.
- **Submarine Sort:** Submarine centered; items above or beside.
- **Starfish Match:** Grid centered; standard background.

All scenes use full viewport or GameStageCard bounds. No full-screen takeover beyond current play layout.

---

## 7. Do / Don't List

### Do

- Reuse existing `assets/graphics/` SVGs where possible.
- Use design tokens for all colors, spacing, radii.
- Keep shapes simple, chunky (kid-friendly).
- Ensure 44px minimum tap targets.
- Provide `aria-hidden="true"` for decorative elements.
- Test with `prefers-reduced-motion: reduce` enabled.

### Don't

- Introduce realistic or scary imagery.
- Use flashing or rapid flicker (seizure risk).
- Add gradients or textures that increase file size significantly.
- Create assets that rely on small details (hard to see on small screens).
- Use animation for critical feedback only (correct/wrong); keep decorative motion minimal under reduced motion.

---

## 8. prefers-reduced-motion Considerations

| Element | Default | Reduced Motion |
|---------|---------|----------------|
| Bubble float | Gentle drift animation | Static |
| Pop / burst | Scale + opacity 0.3s | Instant opacity change |
| Drag feedback | Smooth transition | Instant position update |
| Star reveal | Star-pop animation | Instant visibility |
| Confetti | Disabled or minimal | Disabled |
| Card flip | 0.3s rotateY | Instant (no flip) |
| Fish eat | Short wiggle | Static |

All minigame components MUST wrap animations in:

```css
@media (prefers-reduced-motion: no-preference) {
  .animated-thing { animation: ...; }
}
@media (prefers-reduced-motion: reduce) {
  .animated-thing { animation: none; }
}
```

Or rely on the global `--app-transition: 0s` override in `tokens.css`.

---

## Checks Required

- [ ] All new SVGs under 2 KB each
- [ ] Total new assets under 80 KB
- [ ] No animation without reduced-motion fallback
- [ ] Color palette stays within tokens
- [ ] Placeholder assets documented for implementation phase
