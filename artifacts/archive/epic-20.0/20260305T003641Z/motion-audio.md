# Epic 20 — Motion & Audio Design

> Planning document. No code changes.
> Motion/Audio Designer perspective for Rekenreis UI rebuild.

---

## 1. Animation Inventory (Per Screen)

### 1.1 Map Screen (`/map`)

| Element | Animation | Trigger | Duration | Easing |
|--------|-----------|---------|----------|--------|
| **Node pulse** | Subtle scale + opacity pulse on unlocked/current nodes | On mount, or when node becomes current | 1.5s infinite | `ease-in-out` |
| **Path draw-in** | SVG path `stroke-dasharray` / `stroke-dashoffset` reveal | On mount | 0.8s | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Avatar bounce** | Small vertical bounce (translateY) on current node | On mount, or when level changes | 0.4s | `ease-out` |
| **Node entrance** | Staggered fade-in + scale (0.9 → 1) for nodes | On mount | 0.3s per node, 50ms stagger | `ease-out` |
| **Lock icon** | None (static) | — | — | — |

**Implementation notes:**
- Node pulse: `@keyframes node-pulse { 0%, 100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.05); opacity: 0.9 } }`
- Path: Use `stroke-dasharray` = path length, animate `stroke-dashoffset` from length to 0
- Avatar: `@keyframes avatar-bounce { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }`

---

### 1.2 Play Screen (`/play`)

| Element | Animation | Trigger | Duration | Easing |
|--------|-----------|---------|----------|--------|
| **Problem card entrance** | Fade-in + slide-up (translateY 12px → 0) | When new question loads | 0.35s | `ease-out` |
| **Keypad press feedback** | Scale down (1 → 0.95) on mousedown/touchstart | User press | 0.1s | `ease-out` |
| **Keypad release** | Scale back to 1 | User release | 0.15s | `ease-out` |
| **Check button press** | Same as keypad key | User press | 0.1s / 0.15s | `ease-out` |
| **Feedback area** | Fade-in + scale (0.98 → 1) | When feedback appears | 0.25s | `ease-out` |
| **Correct feedback** | Existing `feedback-bounce` (SkinClassic) | Correct answer | 0.25s | `ease-out` |
| **Wrong feedback** | Existing `feedback-shake` (SkinClassic) | Wrong answer | 0.25s | `ease-out` |

**Implementation notes:**
- Reuse `feedback-bounce` and `feedback-shake` from `SkinClassic.vue` (lines 180–189)
- Keypad: `:active { transform: scale(0.95) }` with `transition: transform var(--app-transition)`
- Problem card: `animation: problem-enter 0.35s ease-out` on mount

---

### 1.3 Level Complete Modal

| Element | Animation | Trigger | Duration | Easing |
|--------|-----------|---------|----------|--------|
| **Modal backdrop** | Fade-in (opacity 0 → 1) | Modal open | 0.2s | `ease-out` |
| **Modal panel** | Scale (0.95 → 1) + fade-in | Modal open | 0.3s | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| **Star fly-in** | Stars animate from center/off-screen to final positions | Modal open, 0.2s delay | 0.5s each, 80ms stagger | `ease-out` |
| **Confetti burst** | Particles emit and fall (see §2) | Modal open, 0.3s delay | 1.2s | Various |
| **Mascot bounce** | Gentle bounce loop | Modal open | 0.6s, 2 iterations | `ease-in-out` |
| **Next button** | Fade-in | After stars + mascot | 0.25s, 0.5s delay | `ease-out` |

**Implementation notes:**
- Modal panel: `@keyframes modal-enter { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }`
- Star fly-in: Each star has `animation-delay` offset; animate from `transform: scale(0) translateY(-20px)` to final

---

### 1.4 Mistakes Review Screen

| Element | Animation | Trigger | Duration | Easing |
|--------|-----------|---------|----------|--------|
| **Card slide-in** | Slide from right (translateX 24px → 0) + fade-in | On mount, staggered | 0.35s per card, 60ms stagger | `ease-out` |
| **Page title** | Fade-in | On mount | 0.25s | `ease-out` |

**Implementation notes:**
- Cards: `@keyframes card-slide { from { opacity: 0; transform: translateX(24px) } to { opacity: 1; transform: translateX(0) } }`
- Use `animation-delay` for stagger: `nth-child(n) { animation-delay: calc((n - 1) * 60ms) }`

---

## 2. Confetti System (CSS-Only)

### 2.1 Approach

- **No canvas, no JS animation libs.** Pure CSS: multiple `<div>` or `<span>` elements with `position: absolute`, each with a unique `animation` for fall + rotation.
- **Particle count:** 24–32 particles (balance: visual impact vs. DOM/CSS cost).
- **Colors:** From design tokens: `--app-primary`, `--app-secondary`, `--app-correct`, `--app-surface-elevated`, `#ffd54f` (gold accent).
- **Duration:** 1.2s total; particles start at 0.3s delay after modal open.
- **Shape:** Small squares (8×8px) or circles; some rotate, some don’t.

### 2.2 Keyframe Structure

```css
@keyframes confetti-fall-1 {
  0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
}
/* Variants: confetti-fall-2, confetti-fall-3 with different translateX, rotate, duration */
```

- Each particle: random-ish `left`, `animation-delay`, `animation-duration` (0.8s–1.4s), `animation-name` (one of 3–4 variants).
- Use CSS custom properties or inline styles for variation: `--confetti-x: 10px`, `--confetti-delay: 0.1s`.

### 2.3 Reduced Motion

- **`prefers-reduced-motion: reduce`:** Disable confetti entirely. Optionally show 3–5 static sparkle icons (SVG) with no animation.

---

## 3. Reduced Motion Behavior

| Animation | Full Motion | Reduced Motion |
|-----------|-------------|----------------|
| Node pulse | 1.5s infinite pulse | None (static) |
| Path draw-in | 0.8s stroke reveal | Instant (path visible) |
| Avatar bounce | 0.4s bounce | None (static) |
| Problem card entrance | 0.35s slide-up | Instant (opacity only, 0.1s) |
| Keypad press | 0.1s scale | Instant (no scale) |
| Feedback bounce/shake | 0.25s | None (per SkinClassic) |
| Modal backdrop | 0.2s fade | Instant |
| Modal panel | 0.3s scale | Instant |
| Star fly-in | 0.5s staggered | Instant (no animation) |
| Confetti | 1.2s burst | **Disabled** (or static sparkles) |
| Mascot bounce | 0.6s loop | None (static) |
| Card slide-in (mistakes) | 0.35s stagger | Instant (opacity 0.15s) |

**Implementation:** All animations wrapped in `@media (prefers-reduced-motion: no-preference)` or use `@supports`; override with `animation: none` and `transition: none` in `@media (prefers-reduced-motion: reduce)`. Tokens.css already sets `--app-transition: 0s` when reduced (lines 52–56).

---

## 4. Sound Integration

### 4.1 Existing useSound Hooks

From `composables/useSound.ts`:

- `playCorrect()` — correct answer
- `playWrong()` — wrong answer
- `playCelebrate()` — celebration (daily goal, unlock, level complete)

### 4.2 Epic 20 Integration Points

| Event | Hook | Notes |
|-------|------|-------|
| Correct answer (per problem) | `playCorrect()` | Already in `play.vue` (line 108) |
| Wrong answer | `playWrong()` | Already in `play.vue` (line 109) |
| Level complete modal open | `playCelebrate()` | Add in play page or LevelCompleteModal when modal opens |
| Keypad key press | None | Optional: subtle tap sound; not in current SFX set — skip for MVP |
| Mistakes review screen | None | No sound on entry |

### 4.3 New Call Site

- **Level complete:** When `LevelCompleteModal` opens (pack mode, last problem correct), call `sound.playCelebrate()`. Pass `useSound(profile)` from parent or inject.

---

## 5. Timing / Easing Standards

| Token / Value | Usage |
|---------------|--------|
| `--app-transition` | Default: `0.2s ease`; `0s` when reduced motion |
| Micro-interactions (key press) | `0.1s ease-out` |
| Entrances (cards, modals) | `0.25s–0.35s ease-out` |
| Celebratory (stars, confetti) | `0.5s–1.2s` with `ease-out` or `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Loops (pulse, bounce) | `1s–1.5s ease-in-out` |

**Easing tokens (add to tokens.css if needed):**

```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

*End of Motion & Audio Design*
