# Epic 20 — Art Direction

**Rekenreis** kindergarten math game (ages 4–7). Planning document for UI rebuild to match kindergarten game reference style.

---

## 1. Theme Evolution

**Current:** Underwater theme (teal/cyan gradient, bubble patterns, wave overlay, Nunito/Quicksand). Used in `AppShell`, `GameStageCard`, `NavTabs`, and all skins.

**Evolution:** Keep the underwater palette as the foundation but extend it to support a **game map + keypad** aesthetic:

- **Map path:** Introduce a winding road/path metaphor that sits on top of the existing gradient. The path is a soft, organic shape (like a river or trail) rather than a rigid grid. Use the same `--app-bg` gradient as the sky/water background; the path uses `--app-surface` or a slightly warmer tone (`#e8f5e9` / mint) to contrast.
- **Play area:** Keep the `GameStageCard` surface (`--app-surface`) for the problem card. Add a subtle "game board" feel: slightly stronger shadow, rounded corners for a tactile card look.
- **Keypad:** Numeric keys should feel like physical buttons—rounded, with slight elevation. Use `--app-primary` for active states.

**Principle:** The underwater theme is the *world*; the map path and keypad are *objects within that world*. They share the same color family but use distinct surface treatments.

---

## 2. Color Palette

### Updated tokens (add to `assets/css/tokens.css`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--app-bg` | `linear-gradient(135deg, #0d47a1 0%, #006064 50%, #00838f 100%)` | Keep (unchanged) |
| `--app-bg-fallback` | `#006064` | Keep |
| `--app-surface` | `rgba(178, 223, 219, 0.95)` | Keep |
| `--app-surface-elevated` | `rgba(224, 247, 250, 0.98)` | Keep |
| `--app-primary` | `#00bcd4` | Keep |
| `--app-primary-hover` | `#00acc1` | Keep |
| `--app-secondary` | `#4dd0e1` | Keep |
| `--app-correct` | `#69f0ae` | Keep |
| `--app-wrong` | `#ff8a65` | Keep |
| `--app-muted` | `#80cbc4` | Keep |
| `--app-text` | `#e0f7fa` | Keep |
| `--app-text-on-surface` | `#004d40` | Keep |
| **NEW** `--app-map-path` | `#b2dfdb` or `rgba(178, 223, 219, 0.85)` | Winding path fill |
| **NEW** `--app-map-path-edge` | `#80cbc4` | Path outline |
| **NEW** `--app-node-unlocked` | `#fff8e1` | Level node background (unlocked) |
| **NEW** `--app-node-locked` | `rgba(178, 223, 219, 0.5)` | Level node locked state |
| **NEW** `--app-keypad-key` | `--app-surface` | Keypad button default |
| **NEW** `--app-keypad-key-active` | `--app-primary` | Keypad key pressed |

**Usage:** Map path uses `--app-map-path`; level nodes use `--app-node-unlocked` / `--app-node-locked`; keypad keys use `--app-keypad-key` with `--app-keypad-key-active` on press.

---

## 3. Typography

**Font stack (keep):** `'Nunito', 'Quicksand', 'Comic Sans MS', 'Chalkboard SE', system-ui, sans-serif` via `--app-font`.

**Sizes (extend tokens):**

| Context | Token / Value | Notes |
|---------|---------------|-------|
| Base | `--app-font-size-base` (1rem) | Body text |
| Large | `--app-font-size-lg` (1.25rem) | Buttons, labels |
| XL | `--app-font-size-xl` (1.5rem) | Section headers |
| 2XL | `--app-font-size-2xl` (1.875rem) | Page titles |
| **NEW** Problem | `2.5rem` (40px) | Problem card `a + b = ?` |
| **NEW** Keypad | `1.75rem` (28px) | Numeric key labels |
| **NEW** CTA | `1.5rem` (24px) | "Play", "Controleer", "Next" |

**Weight:** `--app-font-weight-normal` (600), `--app-font-weight-bold` (700). Problem numbers use bold.

---

## 4. Shape Language

| Element | Shape | Radius | Notes |
|---------|-------|--------|-------|
| Buttons | `--app-radius-md` (0.75rem) | Pill for profile, rounded for CTAs |
| Level nodes | Circle | `50%` | `min-width: 3rem` (48px), `min-height: 3rem` |
| Problem card | `--app-radius-lg` (1rem) | Same as `GameStageCard` |
| Keypad keys | `--app-radius-md` | Slightly larger than current `--app-radius-sm` |
| Modal | `--app-radius-xl` (1.25rem) | Centered overlay |
| Map path | Organic SVG | `stroke-linecap: round`, `stroke-linejoin: round` |

**Principle:** Rounded, soft shapes everywhere. Avoid sharp corners.

---

## 5. Icon / Illustration Style

- **Inline SVG:** Use existing pattern: `NavIconFish`, `NavIconChartBubbles`, `NavIconGearCoral`—stroke-based, `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round`.
- **Flat:** No gradients; solid fills or strokes. Colors from `--app-primary`, `--app-text`, `--app-surface`.
- **Mascot:** `assets/graphics/characters/placeholder.svg` exists. Replace with a friendly mascot (e.g., fish, turtle, or seahorse) that:
  - Is flat/rounded (no sharp edges)
  - Has a neutral or happy expression
  - Uses `--app-primary` and `--app-surface` tones
  - Appears in level-complete modal and mistakes review

**Level nodes:** Stars for completed; lock icon for locked. Use inline SVG, same stroke style as nav icons.

---

## 6. Background Patterns

| Context | Pattern | Implementation |
|---------|---------|----------------|
| App shell | `bubble-pattern.svg` + `wave-overlay.svg` | Keep (AppShell) |
| **Map path** | Winding path | SVG `<path>` with `d` attribute for smooth curve. CSS: `fill: var(--app-map-path)`, `stroke: var(--app-map-path-edge)`, `stroke-width: 4`. Path can be rendered as background or inline SVG in map component. |
| **Play area** | Solid `--app-surface` | `GameStageCard`; no pattern on problem card |
| **Modal backdrop** | Semi-transparent | `rgba(0, 0, 0, 0.4)` (same as `PlayModeSelector` backdrop) |

**Map path:** Use a single SVG path that winds from top-left to bottom-right. Example structure: `M 0 20 Q 80 0 160 40 T 320 80 T 480 60 T 640 100` (adjust values for viewport). Path should be wide enough to accommodate circular nodes (~60px diameter) along its centerline.

---

## 7. Do / Don't

### Do

- Use `--app-tap-min` (44px) for all interactive elements.
- Keep `--app-transition` for hover/focus; respect `prefers-reduced-motion`.
- Use `--app-correct` for success feedback.
- Use `--app-wrong` for error feedback.
- Keep `GameStageCard` for content areas; extend its styling for problem card.
- Use `Teleport` + `role="dialog"` + `aria-modal="true"` for modals (like `PlayModeSelector`).
- Use `aria-live="polite"` for feedback.

### Don't

- Don't introduce new fonts without design approval.
- Don't use sharp corners (e.g. `border-radius: 0`).
- Don't use pure black (`#000`) for text; use `--app-text-on-surface` or `--app-text`.
- Don't use tiny tap targets (< 44px).
- Don't use complex gradients on small elements.
- Don't use emoji as primary icons; use inline SVG when possible.

---

*End of Art Direction*
