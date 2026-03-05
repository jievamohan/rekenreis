# Epic 20 — Solution Design

> Planning document. No code changes.
> Implementation approach and technical decisions.

---

## 1. Implementation Approach (Per Screen)

### 1.1 Map Screen (`/map`)

**Approach:**
- Single `pages/map.vue` with `useLevelProgress(profile)` and `useProfile()`.
- SVG path: One `<path>` element with `d` attribute for winding curve. Use `stroke-dasharray` and `stroke-dashoffset` for draw-in animation.
- Nodes: `v-for` over level pack; each node positioned via CSS (absolute) or computed from path. Use CSS Grid or Flexbox for rough layout; fine-tune with `top`/`left` from a coordinate array.
- Avatar: Absolutely positioned at current node; use `ProfileData.avatarId` to pick avatar SVG.
- Play CTA: `PrimaryButton` or `NuxtLink` to `/play?source=pack&level={currentLevel}&mode=classic`.

**Key technical choice:** Path + nodes can use a **coordinate array** (e.g. `[{ x: 10, y: 20 }, ...]`) derived from the SVG path or hand-tuned. Simpler: use CSS Grid with `grid-template-areas` or explicit `grid-row`/`grid-column` for node positions.

---

### 1.2 Play Screen (Redesign)

**Approach:**
- Keep `play.vue` structure; replace inner game area with new layout.
- **ProblemCard:** Renders `a + b = ?` large (2.5rem per art-direction). Optional: `HintDots` or visuals alongside.
- **Keypad:** 4×4 grid: rows 1–3 = digits 1–9, row 4 = 0, Clear, Check. Use `display: grid; grid-template-columns: repeat(3, 1fr)`.
- **Check button:** Full-width below keypad or as last key. Calls `onAnswer(enteredValue)`.
- **Feedback:** Same as today (correct/wrong message + Next). Reuse `HintDots`/`HintNumberLine` when `hintToShow` is set.

**Key technical choice:** Keypad builds string, converts to number on Check. Validate: non-empty, max 2 digits for sums ≤ 20.

---

### 1.3 Level Complete Modal

**Approach:**
- `Teleport` to body (like `PlayModeSelector`).
- Backdrop: `position: fixed; inset: 0; background: rgba(0,0,0,0.4)`.
- Panel: Centered, `max-width: 20rem`, `border-radius: var(--app-radius-xl)`.
- Content: Mascot img/SVG, 1–3 stars (based on performance), "Next" button.
- Confetti: `Confetti.vue` with 24–32 divs, each with unique `animation` and `animation-delay`.
- On "Next": Emit to parent; parent calls `nextQuestion()` or navigates to `/map` or shows mistakes review.

---

### 1.4 Mistakes Review Screen

**Approach:**
- Modal or dedicated page. Modal recommended for MVP.
- List: `v-for` over `mistakes` array. Each item: `{{ a }} + {{ b }} = ?` — You said {{ selectedAnswer }}, correct is {{ correctAnswer }}.
- Optional: `HintDots` or `HintNumberLine` for each.
- CTA: "Try again" (restart level) or "Back to map".

---

## 2. CSS Techniques

### 2.1 Map Path

- **SVG path:** Single `<path d="M ...">` with `fill: none`, `stroke: var(--app-map-path)`, `stroke-width: 4`, `stroke-linecap: round`, `stroke-linejoin: round`.
- **Draw-in:** `stroke-dasharray: 1000` (or path length), `stroke-dashoffset: 1000` → animate to `0` with `@keyframes`.

### 2.2 Keypad

- **Layout:** `display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;`
- **Keys:** `min-height: var(--app-tap-min)`, `min-width: var(--app-tap-min)`, `border-radius: var(--app-radius-md)`.
- **0 key:** Span 2 columns or center in row 4.

### 2.3 Confetti (CSS-Only)

- Container: `position: absolute; inset: 0; pointer-events: none; overflow: hidden`.
- Particles: `position: absolute; width: 8px; height: 8px; background: var(--color); border-radius: 2px;`
- Each: `animation: confetti-fall-X Ys Zs ease-out forwards; left: X%; top: 0;`
- 3–4 keyframe variants with different `translateY`, `translateX`, `rotate`.

### 2.4 Reduced Motion

- All animations: wrap in `@media (prefers-reduced-motion: no-preference)` or override in `@media (prefers-reduced-motion: reduce) { animation: none; transition: none; }`.

---

## 3. Component Hierarchy Diagrams (Text-Based)

### 3.1 Map Page

```
map.vue
├── AppShell (layout)
│   └── NavTabs
├── main.map-content
│   ├── MapPath (svg)
│   ├── .map-nodes
│   │   └── MapNode (v-for level in levelPack)
│   ├── MapAvatar
│   └── PrimaryButton "Play"
```

### 3.2 Play Page (Redesign)

```
play.vue
├── PlayModeSelector (v-model)
├── nav.skin-picker
├── StatPill
├── #game-main
│   └── GameStageCard (or div.play-area)
│         ├── header.playful-header (mascot + level label)
│         ├── ProblemCard
│         │     └── p.prompt (a + b = ?)
│         ├── Keypad
│         │     ├── button (1-9, 0)
│         │     ├── button Clear
│         │     └── button Check
│         └── .feedback (v-if feedback)
│               ├── p (correct/wrong)
│               ├── HintDots | HintNumberLine (optional)
│               └── button Next
├── LevelCompleteModal (v-if)
└── MistakesReviewModal (v-if)
```

### 3.3 Level Complete Modal

```
LevelCompleteModal.vue
├── Teleport to body
├── .backdrop
└── .panel
    ├── img.mascot
    ├── .stars (1-3 star icons)
    ├── Confetti (v-if !reducedMotion)
    ├── p "Level complete!"
    └── PrimaryButton "Next"
```

---

## 4. Key Technical Decisions and Rationale

| Decision | Rationale |
|----------|------------|
| **CSS/SVG only, no canvas** | Matches constraints; no new deps; works everywhere. |
| **Keypad instead of multiple-choice** | Matches kindergarten reference; more flexible for future (e.g. 2-digit answers). |
| **Level complete as modal, not new page** | Keeps flow tight; less navigation. |
| **Mistakes as modal first** | Simpler; can add `/mistakes` route later for "review later". |
| **Confetti as CSS divs** | No canvas, no JS animation lib; respects reduced motion by disabling. |
| **levelProgress in ProfileProgress** | Fits existing schema; single source of truth for map. |
| **One problem per level (MVP)** | Simplest; level pack has 27 entries = 27 levels. Can group later. |
| **useLevelProgress composable** | Encapsulates read/write of levelProgress; keeps play.vue clean. |
| **Map path as SVG path** | Scalable, themeable via CSS; draw-in animation straightforward. |
| **Lazy-load map** | Route-level split; map not needed on play page. |

---

*End of Solution Design*
