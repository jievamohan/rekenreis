# Epic 20 Design Bible — UI Rebuild (Level Map, Keypad, Level Complete, Mistakes Review)

> PlanRef (master): artifacts/archive/epic-20.0/latest
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Children ages 4–7 (Dutch: kleuters, groep 1–3), playing at home or in school on tablets or shared devices.

**Primary experience goals:**

| Goal | Feeling |
|------|---------|
| Belonging | "This is my game. I see my avatar. I know where I am." |
| Progress | "I'm on a path. I can see how far I've come and what's next." |
| Confidence | "I can tap big buttons. I know what to do." |
| Delight | "Stars, confetti, mascot—I did it!" |
| Safety | "Wrong answers don't punish me. I can try again." |
| Clarity | "The problem is big and clear. I type my answer and press Check." |

**"Looks/feels like" acceptance criteria:**

1. **`/map`**: Winding SVG path, circular level nodes with stars/locks, avatar bubble at current node, big "Play" CTA. No plain white.
2. **`/play`**: Big ProblemCard (`a + b = ?` at 2.5rem), NumericKeypad (0–9, clear, check), playful header with score/progress. No multiple-choice buttons.
3. **Level complete modal**: Mascot + 1–3 star reward + confetti (reduced-motion safe) + "Next" CTA.
4. **Mistakes review**: Card-based friendly recap per wrong answer with visuals (HintDots). Encouraging tone, no red X marks.

**Game design notes:**
- **Level progression**: Pack mode levels (5 problems each). Complete level N → unlock N+1.
- **Star system**: 0 wrong = 3 stars, 1 wrong = 2 stars, 2+ wrong = 1 star. Best-of on replay.
- **Keypad model**: Digits build answer string → "Check" submits as number via `onAnswer(value)`. Max 2 digits.
- **Mistakes data**: Session-only `MistakeItem[]` = `{ a, b, correctAnswer, selectedAnswer }`. Collected during play, cleared on new level.

**Non-goals:**
- No plain white document pages, no heavy game engine (CSS/SVG only), no host-side Playwright, no new operators, no cloud sync, no monetization, no full skin redesign.

---

## 2. Visual Direction (Art Director)

**Theme evolution:** Keep underwater palette as the world; map path and keypad are objects within that world. Same color family, distinct surface treatments.

**Color palette (new tokens):**

| Token | Value | Usage |
|-------|-------|-------|
| `--app-map-path` | `#b2dfdb` / `rgba(178,223,219,0.85)` | Winding path fill |
| `--app-map-path-edge` | `#80cbc4` | Path outline |
| `--app-node-unlocked` | `#fff8e1` | Level node bg (warm cream) |
| `--app-node-locked` | `rgba(178,223,219,0.5)` | Locked node bg |
| `--app-keypad-key` | `var(--app-surface)` | Keypad button default |
| `--app-keypad-key-active` | `var(--app-primary)` | Keypad key pressed |

Existing tokens (`--app-bg`, `--app-surface`, `--app-primary`, `--app-correct`, `--app-wrong`, etc.) unchanged.

**Typography:** Keep `Nunito, Quicksand, Comic Sans MS, Chalkboard SE, system-ui`. New size tokens: problem 2.5rem, keypad 1.75rem, CTA 1.5rem.

**Shapes:** Rounded everywhere. Level nodes = circles (48px min). Buttons = `--app-radius-md`. Cards = `--app-radius-lg`. Modal = `--app-radius-xl`. Map path = organic SVG with `stroke-linecap: round`.

**Icon/illustration style:** Inline SVG, flat/rounded, stroke-width 1.5. Mascot from `assets/graphics/characters/mascot.svg` (friendly, happy, underwater creature). Stars and locks as inline SVG icons.

**Background patterns:** App shell keeps `bubble-pattern.svg` + `wave-overlay.svg`. Map path as inline SVG. Modal backdrop = `rgba(0,0,0,0.4)`.

**Do/Don't:**
- DO: Use `--app-tap-min` (44px), respect `prefers-reduced-motion`, use `Teleport` + `role="dialog"` for modals.
- DON'T: Sharp corners, pure black text, tiny tap targets, emoji as primary icons, new font families.

---

## 3. UX Layout & Components (UX Designer)

**Primary screens impacted:** `/map` (new), `/play` (rebuild), level complete modal (new), mistakes review (new).

### Screen layouts

**`/map`:** Full viewport within AppShell (no GameStageCard wrapper). Inline SVG winding path with circular nodes positioned along it. Avatar bubble at current node. Big "Play" PrimaryButton at bottom. Scrollable vertically; auto-scroll to current node.

**`/play`:** Three zones — header bar (60px, score/progress), problem area (40% height, ProblemCard), keypad area (60% height, NumericKeypad + Check). Within AppShell + GameStageCard.

**Level complete modal:** Fixed overlay, centered panel (max-width 22rem). Mascot top, stars middle, "Next" bottom. Confetti particles in overlay. Focus trap.

**Mistakes review:** Card-based list within modal or page. Mascot encouragement header. Per-mistake card: problem + child's answer + correct answer + optional HintDots. CTAs: "Try Again" + "Back to Map".

### Navigation model

| From | To | Trigger |
|------|----|---------|
| `/` or `/map` | `/play?level=N` | Tap Play CTA or unlocked node |
| `/play` (level end) | Level complete modal | Last problem of level answered |
| Level complete modal | `/map` or next level | Tap "Next" |
| Level complete modal | Mistakes review | Tap "Review Mistakes" (if errors) |
| Mistakes review | `/map` or retry level | Tap CTA |

### Component catalog

**New:** `MapPath`, `MapNode`, `MapAvatar` (in `components/map/`), `Keypad`, `ProblemCard` (in `components/play/`), `LevelCompleteModal` (in `components/modals/`), `MistakesReview` (in `components/review/`), `Confetti` (in `components/effects/`).

**Modified:** `play.vue` (integrate Keypad/ProblemCard), `AppShell`/`NavTabs` (add Map tab), `SkinClassic` (may adopt Keypad).

### Tap targets & accessibility

- All interactive: ≥ 44px (`--app-tap-min`).
- Keypad keys: 56px min.
- Level nodes: 48px min.
- CTAs: 64px min height.
- Focus order: Header → Problem → Keypad → Check.
- Modals: focus trap, Escape to close, `aria-modal="true"`.

---

## 4. Motion & Audio Rules (Motion/Audio)

### Animation inventory

| Screen | Element | Animation | Duration | Reduced Motion |
|--------|---------|-----------|----------|----------------|
| Map | Node pulse | Scale 1→1.05 loop | 1.5s | None (static) |
| Map | Path draw-in | stroke-dashoffset reveal | 0.8s | Instant |
| Map | Avatar bounce | translateY -4px | 0.4s | None |
| Map | Node entrance | Staggered fade+scale | 0.3s+50ms stagger | Instant |
| Play | Problem card entrance | Slide-up + fade | 0.35s | Opacity only 0.1s |
| Play | Keypad press | Scale to 0.95 | 0.1s | None |
| Play | Feedback | bounce/shake | 0.25s | None |
| Modal | Panel entrance | Scale 0.95→1 + fade | 0.3s | Instant |
| Modal | Star fly-in | Scale 0→1 staggered | 0.5s+80ms | Instant |
| Modal | Confetti burst | Particle fall | 1.2s | Disabled |
| Modal | Mascot bounce | Vertical bounce | 0.6s×2 | None |
| Review | Card slide-in | translateX 24px→0 + fade | 0.35s+60ms stagger | Instant |

### Confetti system

CSS-only, 24–32 `<div>` particles. Colors from tokens + gold. `position: absolute`, random positions, 3–4 keyframe variants. Duration 1.2s. Only for 2+ stars. `prefers-reduced-motion`: disabled entirely or 3–5 static sparkle SVGs.

### Sound integration

- Correct answer: `playCorrect()` (existing).
- Wrong answer: `playWrong()` (existing).
- Level complete modal open: `playCelebrate()` (add call site).
- No new SFX assets needed.

### Timing/easing

- `--app-transition`: `0.2s ease` (default), `0s` (reduced motion).
- Micro: `0.1s ease-out`. Entrances: `0.25–0.35s ease-out`. Celebratory: `0.5–1.2s ease-out` or bounce bezier. Loops: `1–1.5s ease-in-out`.

---

## 5. Accessibility (UX + QA)

**Keyboard model:**
- Map: Tab through unlocked nodes + Play CTA. Enter/Space to select. Locked nodes = `aria-disabled`, not focusable.
- Play: Tab through keypad keys (natural grid order), Enter/Space to press. Tab to Check. Digits also respond to keyboard number keys.
- Modal: Focus trap. Escape closes or advances. First focusable = "Next".
- Review: Tab through cards and CTAs. Logical reading order.

**Focus states:** Visible `outline: 2px solid var(--app-primary)` on all interactive elements. Existing `focus-visible` pattern.

**Contrast:** WCAG AA. `--app-text-on-surface` (#004d40) on `--app-surface` (light teal) passes. `--app-text` (#e0f7fa) on `--app-bg` (dark gradient) passes. Node text on `--app-node-unlocked` (#fff8e1) needs verification (use dark text).

**Reduced motion:** All animations gated by `@media (prefers-reduced-motion: no-preference)`. Confetti disabled. Path/card entrances instant. Existing `--app-transition: 0s` override applies.

**Screen reader:** `aria-live="polite"` on feedback. `role="dialog"` + `aria-modal="true"` on modals. `aria-label` on icon-only buttons. `role="group"` on keypad.

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Where tokens live:** `assets/css/tokens.css` — add new tokens (map-path, keypad, node, easing). `assets/css/graphics.css` — unchanged.

**Where shell lives:** `layouts/default.vue` → `AppShell.vue`. Map page sits within AppShell but without GameStageCard wrapper.

**Component folder structure:**
```
components/
├── map/
│   ├── MapPath.vue
│   ├── MapNode.vue
│   └── MapAvatar.vue
├── play/
│   ├── Keypad.vue
│   └── ProblemCard.vue
├── modals/
│   └── LevelCompleteModal.vue
├── review/
│   └── MistakesReview.vue
└── effects/
    └── Confetti.vue
```

**New composables:**
- `useLevelProgress(profile)` — read/write `levelProgress`, `currentLevel` in `ProfileProgress`.
- `useMistakes()` — collect `MistakeItem[]` during session.

**Data model extension** (`ProfileProgress` in `utils/profileSchema.ts`):
```ts
levelProgress?: Record<number, { stars: number }>
currentLevel?: number
```
Migration: existing profiles get `currentLevel: 1`, `levelProgress: {}`.

**Asset pipeline:** New SVGs needed: `mascot.svg`, `star.svg`, `lock.svg`, `sparkle.svg`. Organized in `assets/graphics/characters/`, `icons/`, `map/`. Each < 2KB.

**Performance:** Bundle stays < 3MB total, < 250KB client JS. Map page route-level split (Nuxt automatic). No new heavy deps. Confetti = 24–32 divs + CSS (negligible).

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Playwright setup:**
- Create `apps/web/playwright.config.ts` with `testDir: './e2e'`, `baseURL` from `BASE_URL` env.
- `e2e/` directory: `map.spec.ts`, `play.spec.ts`, `level-complete.spec.ts`, `mistakes-review.spec.ts`, `visual/*.spec.ts`.
- Run: `docker compose run --rm e2e pnpm exec playwright test` (container-only).

**E2E smoke per screen:**
- Map: page loads, path visible, nodes rendered, Play navigates to /play.
- Play: keypad visible, enter answer + Check, feedback appears, Next loads new question.
- Level complete: modal appears on level end, mascot + stars visible, Next closes modal.
- Mistakes: review cards shown when errors exist, CTA navigates.

**Visual regression:**
- `expect(page).toHaveScreenshot()` with fixed viewport (1280×720).
- Baselines in `e2e/visual/snapshots/`, committed to repo.
- Reduced motion emulated for screenshot stability.
- CI: fail on diff; update with `--update-snapshots` only when intentional.

**Screenshot targets per micro-epic:**

| Micro-Epic | Screenshot |
|------------|-----------|
| 20.1 | Smoke test passes (baseline infrastructure) |
| 20.2 | Full map page, node states |
| 20.3 | Play page with keypad, feedback |
| 20.4 | Level complete modal |
| 20.5 | Mistakes review, all screens final |

**Unit tests:** New `useLevelProgress.test.ts`, `useMistakes.test.ts`. Extend `usePlayGame.test.ts` for initial pack index from `?level=N`.

**Non-flaky strategy:** Prefer `getByRole` + `name`. Disable animations via `prefers-reduced-motion: reduce`. Avoid `waitForTimeout`. Seed localStorage for deterministic state.

---

## 8. Security/Privacy Notes (Security/Privacy)

**New risks:** LOW. Map, keypad, modal, mistakes operate within existing trust boundary (localStorage, static content, no auth).

**Key points:**
- No new secrets, API endpoints, or storage keys.
- Schema extends `ProfileProgress` with numeric fields only (no PII).
- SVGs are static assets; no `v-html` with user data.
- Validate `?level=N` against pack bounds.
- Avatar uses allowlisted `avatarId` values.
- Focus trap on modals; keyboard accessibility preserved.
- Confetti respects `prefers-reduced-motion`.

**Overall risk level: LOW** — UI rebuild with local-only data, no auth/cloud/payments.

---

## 9. Slice Map (Orchestrator)

### Epic 20.1 — Playwright & Tokens Foundation
- **Visual milestone:** Playwright e2e smoke runs in container and passes; new design tokens visible in tokens.css.
- **Files/modules:** `playwright.config.ts`, `e2e/smoke.spec.ts`, `tokens.css`, `useLevelProgress.ts`, `useMistakes.ts`, `profileSchema.ts`.
- **Acceptance:** `docker compose run --rm e2e pnpm exec playwright test` passes. New tokens exist. Composables have unit tests.

### Epic 20.2 — Level Map Screen
- **Visual milestone:** `/map` page shows winding path with circular level nodes (locked/unlocked/completed states), avatar at current node, big Play CTA.
- **Files/modules:** `pages/map.vue`, `components/map/MapPath.vue`, `MapNode.vue`, `MapAvatar.vue`, `NavTabs.vue`, `assets/graphics/icons/star.svg`, `lock.svg`.
- **Acceptance:** Map renders with path and nodes. Play CTA navigates to `/play?level=N`. Screenshot baseline captured. No plain white.

### Epic 20.3 — Play Screen Redesign (Keypad + ProblemCard)
- **Visual milestone:** `/play` uses numeric keypad instead of multiple-choice. Big problem card, "Controleer" CTA, playful header.
- **Files/modules:** `components/play/Keypad.vue`, `ProblemCard.vue`, `play.vue`, `SkinClassic.vue`.
- **Acceptance:** Keypad functional (enter digits, clear, submit). Correct/wrong feedback works. Screenshot baseline captured. No multiple-choice buttons.

### Epic 20.4 — Level Complete Modal + Confetti
- **Visual milestone:** Level complete modal appears after finishing a level with mascot, stars, confetti, and Next CTA.
- **Files/modules:** `components/modals/LevelCompleteModal.vue`, `components/effects/Confetti.vue`, `assets/graphics/characters/mascot.svg`, `play.vue`.
- **Acceptance:** Modal triggers on level completion. Stars reflect accuracy. Confetti plays (respects reduced-motion). Next advances or returns to map. Screenshot captured.

### Epic 20.5 — Mistakes Review + Polish
- **Visual milestone:** Friendly mistakes review with visual cards. All screens polished, accessible, and visually regressed.
- **Files/modules:** `components/review/MistakesReview.vue`, persistence integration, all visual regression baselines.
- **Acceptance:** Mistakes review shows card per wrong answer with visuals. Keyboard nav works across all new screens. Contrast meets WCAG AA. Reduced motion verified. All visual regression baselines committed. CI gates pass.

---

*End of Epic 20 Design Bible*
