# Epic 20 — UX Specification

**Rekenreis** kindergarten math game (ages 4–7). Screen-by-screen layout and interaction specs for the UI rebuild.

---

## 1. Screen-by-Screen Layout Specs

### 1.1 `/map` Screen

**Purpose:** Level selection via winding path. Circular level nodes with stars (completed) or locks (locked). Avatar bubble. Big "Play" CTA.

**Viewport layout:**
- Full viewport within `AppShell` (header + `GameStageCard` area + `NavTabs`).
- No `GameStageCard` wrapper for this screen—map fills the stage area between header and nav.
- Padding: `var(--app-space-md)` (1rem) on sides; `var(--app-space-sm)` top/bottom.

**Path rendering:**
- **Technique:** Inline SVG or `<img>` of SVG. Path drawn as a single `<path>` element with `fill` and `stroke`.
- **Path:** Winding curve from top-left to bottom-right. Width ~80–120px. Path centerline guides node placement.
- **CSS:** `position: absolute` or `position: relative`; path sits behind nodes. `z-index: 0` for path; `z-index: 1` for nodes.

**Node placement:**
- Nodes: circular, `min-width: 3rem` (48px), `min-height: 3rem`.
- Positioned along path centerline at regular intervals (e.g. every 80–100px along path).
- Use `position: absolute` with `left`/`top` (or `transform`) or flex/grid with path as background.
- **Unlocked:** `--app-node-unlocked` bg, star icon if completed, else empty.
- **Locked:** `--app-node-locked` bg, lock icon.

**Avatar bubble:**
- Position: bottom-left or near "Play" CTA. Circular, ~60px diameter. Shows profile avatar.
- Reuse `profile-pill` styling from `AppShell`; can be a smaller variant.

**"Play" CTA:**
- Large button: `min-height: 4rem` (64px), `font-size: 1.5rem`, `--app-radius-lg`.
- Position: bottom-right or center-bottom of map area. Clear primary CTA.

**Scroll behavior:**
- Map content may exceed viewport height. Use `overflow-y: auto` on scroll container.
- Path should be scrollable; nodes scroll with path.

---

### 1.2 `/play` Screen

**Purpose:** Big problem card, numeric keypad, "Controleer" (Check) button, playful header with score/progress.

**Layout (top-to-bottom):**

| Zone | Height | Content |
|------|--------|---------|
| Header bar | ~60px | Score, streak, progress indicator |
| Problem area | ~40% of remaining height | Problem card with visuals |
| Keypad area | ~60% of remaining height | Numeric keys + "Controleer" |

**Header bar:**
- Fixed or sticky at top of play content. `display: flex`, `justify-content: space-between`, `align-items: center`.
- Left: `StatPill`-style score and streak.
- Right: optional progress (e.g. "3/10").
- Padding: `var(--app-space-md)` (1rem) horizontal.

**Problem area (top 40%):**
- Centered in `GameStageCard` or dedicated problem container.
- Problem card: `max-width: 20rem`, `padding: var(--app-space-lg)` (1.5rem).
- Problem text: `font-size: 2.5rem` (40px) for `a + b = ?`.
- Visuals: optional dots or illustrations (e.g. `HintDots` style) when `hintMode` allows.
- Card: `--app-surface`, `--app-radius-lg`, `--app-shadow-md`.

**Keypad area (bottom 60%):**
- Grid: 4 columns (0–9, backspace, etc.) or 3 rows × 4 keys. Keys: `min-width: 3.5rem`, `min-height: 3.5rem`.
- Gap: `var(--app-space-sm)`.
- "Controleer" button: full width below keypad, `min-height: 4rem`, `font-size: 1.5rem`.

**Existing components:**
- `SkinClassic` / `ModeClassic` render `choices` as buttons. Replace with `NumericKeypad` component.
- `StatPill` for header.
- `GameStageCard` wraps content.

---

### 1.3 Level Complete Modal

**Purpose:** Mascot + star reward animation + "Next" CTA. Confetti particles.

**Layout:**
- Centered overlay: `position: fixed`, `inset: 0`, `z-index: 1000`.
- Backdrop: `rgba(0, 0, 0, 0.4)` (same as `PlayModeSelector`).
- Panel: `max-width: 22rem`, `padding: var(--app-space-xl)` (2rem), `--app-radius-xl` (1.25rem) (see `PlayModeSelector` pattern).

**Structure:**
1. **Mascot area:** Top ~120px. Mascot character (from `assets/graphics/characters/`).
2. **Star animation:** 1–3 stars that animate (scale, opacity). Use CSS `@keyframes` or lightweight animation.
3. **Message:** "Goed gedaan!" or similar. `font-size: var(--app-font-size-xl)`.
4. **"Next" CTA:** Bottom, full width, `min-height: 4rem`, `font-size: 1.5rem`.

**Confetti:**
- Optional: small particles (e.g. 20–40 divs) with `position: absolute`, random positions, fall animation. Respect `prefers-reduced-motion`.
- Colors: `--app-primary`, `--app-correct`, `--app-surface`.

**Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` for title. Focus trap. Escape to close (if applicable).

---

### 1.4 Mistakes / Review Screen

**Purpose:** Friendly visual recap of wrong answers, not plain text.

**Layout:**
- Card-based: one card per mistake.
- Each card: `--app-surface`, `--app-radius-lg`, `padding: var(--app-space-md)`.
- Card content: problem (e.g. "3 + 5 = ?"), correct answer, optional visual (dots or number line).

**Mascot encouragement:**
- Mascot at top or between cards. Message: "Laten we dit nog eens bekijken" or similar.
- `font-size: var(--app-font-size-lg)`.

**Card structure:**
- Problem: `font-size: var(--app-font-size-xl)`.
- Correct answer: highlighted with `--app-correct`.
- Optional: small illustration (e.g. `HintDots` style) showing the correct sum.

**Navigation:** "Terug" or "Volgende" to return to map or next level.

---

## 2. Navigation Model

| From | To | Trigger |
|------|----|---------|
| `/` | `/map` or `/play` | Entry via "Play" link |
| `/map` | `/play` | Tap "Play" CTA or tap unlocked level node |
| `/play` | Level complete modal | Correct answer on last problem of level |
| Level complete modal | `/map` or next level | Tap "Next" |
| `/play` | Mistakes review | Level complete with errors |

**Flow:**
- `/map` → select level → `/play?level=N`
- `/play` complete → modal → "Next" → `/map` or next level
- If mistakes: show review screen before or after modal (TBD in implementation)

---

## 3. Component Catalog

### New components

| Component | Purpose | Lane |
|-----------|---------|------|
| `MapScreen` | `/map` page layout, path, nodes | W1 |
| `MapPath` | SVG winding path | W1 |
| `LevelNode` | Circular node (star/lock) | W1 |
| `NumericKeypad` | 0–9 + backspace/clear | W1 |
| `LevelCompleteModal` | Mascot + star + "Next" | W1 |
| `MistakesReview` | Card-based recap | W1 |
| `ConfettiParticles` | Optional confetti | W1 |

### Modified components

| Component | Changes |
|-----------|---------|
| `AppShell` | Optional: hide `GameStageCard` on `/map`; add map-specific layout |
| `GameStageCard` | Optional: variant for play (no padding) or full-bleed |
| `SkinClassic` | Replace `choices` with `NumericKeypad`; restructure layout (top 40% / bottom 60%) |
| `PlayModeSelector` | Reference for modal pattern; no changes |
| `StatPill` | Reuse in play header |

**Existing:** `AppShell`, `GameStageCard`, `NavTabs`, `PlayModeSelector`, `ProfileSelector`, `StatPill`, `PrimaryButton`, `SecondaryButton`, `HintDots`, `HintNumberLine`.

---

## 4. Interaction Patterns

### Keypad input

- Tap key → append digit to answer display.
- Backspace/clear → remove last digit or clear.
- "Controleer" → submit answer; disable keys until feedback.
- Focus: visible focus ring (`outline: 2px solid var(--app-primary)`).

### Level selection

- Tap unlocked node → navigate to `/play?level=N`.
- Tap locked node → optional tooltip or no action.
- Tap "Play" → start first unlocked level or last played.

### Modal dismiss

- "Next" button → close modal, trigger next action.
- Escape key → close (if applicable).
- Backdrop click → optional (match `PlayModeSelector` behavior).

---

## 5. Responsive Notes

- **Mobile-first:** Base layout for 320px–480px width.
- **Breakpoint:** 640px+ for slightly larger cards and keypad keys.
- **Landscape:** On `/play`, consider keypad height; problem area may shrink. Ensure keypad remains usable (min 44px tap targets).
- **Safe area:** Respect `env(safe-area-inset-*)` for notched devices.

---

## 6. Tap Target & Accessibility Notes

### Tap targets

- Minimum: `--app-tap-min` (44px) for all interactive elements.
- Keypad keys: `min-width: 3.5rem` (56px), `min-height: 3.5rem`.
- Level nodes: `min-width: 3rem` (48px), `min-height: 3rem`.
- CTAs: `min-height: 4rem` (64px).

### Focus order

- Skip link: "Skip to game" (already in `play.vue`).
- Map: Profile → Level nodes → Play CTA.
- Play: Header → Problem → Keypad → Controleer.
- Modal: Focus first focusable (e.g. "Next" button).

### Keyboard

- Tab through interactive elements.
- Enter/Space for buttons.
- Escape for modals.

### Screen readers

- `aria-label` on icon-only buttons.
- `aria-live="polite"` for feedback.
- `role="group"` for problem and choices.
- `aria-pressed` for toggle states.

---

*End of UX Specification*
