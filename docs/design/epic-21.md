# Epic 21 Design Bible

> PlanRef (master): artifacts/archive/epic-21.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience:** Kleuters (4–6), parents, educators in the Netherlands/Flanders
- **Primary experience goal:** Sustain engagement through varied interaction patterns (6 minigames) while maintaining a safe, positive math practice environment — entirely in Dutch.
- **"Looks/feels like" acceptance criteria:**
  - A play session cycles through multiple distinct minigames (tap, drag, timed) automatically
  - Every visible string is in Dutch; no English leaks into the UI
  - Difficulty gently ramps with progression; no punitive fail states
  - Each minigame is keyboard-playable and respects prefers-reduced-motion
- **Non-goals:** i18n beyond Dutch, implementing all 6 minigames at once, heavy game engines, new math operators, backend changes, monetization

### The 6 Invented Minigames

| # | Name | Pattern | Core Mechanic | Difficulty Knobs |
|---|------|---------|---------------|------------------|
| 1 | **Bubble Pop** | tap | Bubbles float up with numbers; tap correct answer | bubbleCount (3–6), floatSpeed, distractorProximity |
| 2 | **Treasure Dive** | drag | Gems/shells with numbers; drag correct one into chest | gemCount (3–5), gemSpread, hitboxTolerance |
| 3 | **Fish Feed** | timed scene | Pellets labeled with numbers; tap correct pellet to feed fish | timerSeconds (8–20), pelletFlowRate, maxPelletsVisible |
| 4 | **Coral Builder** | scene/tap | Coral pieces with numbers; tap correct piece to build reef | pieceCount (3–5), pieceRevealDelay |
| 5 | **Submarine Sort** | drag | Items with numbers; drag correct item into compartment | compartmentCount (2–3), itemCount (3–5) |
| 6 | **Starfish Match** | tap/timed | Starfish pairs; tap pair whose numbers sum to answer | pairCount (2–4), timerSeconds (10–25) |

All minigames are **interaction wrappers**: they receive `AdditionQuestion` + `onAnswer` callback from the core loop. No duplicated math logic.

### Mapping Table

- File: `apps/web/content/minigame-map.v1.json` (versioned)
- Supports: levelId → direct minigameId, weighted pools per chapter/pack
- Resolution order: byLevelId > byChapter > byPack > default

### Random Serving

- Shuffle-bag algorithm with no-repeat window (N=2–3)
- Deterministic seed via `createSeededRng` (seed = sessionSeed + levelIndex)
- Same seed + mapping → same minigame sequence (testable)

### Difficulty Progression

- Math ranges scale by chapter (ch1–3: max 10, ch4–6: max 15, ch7+: max 20)
- Minigame params scale by level index within pack (lerp between min/max)
- Respect profile's difficultyCeiling; hints always available
- No punitive failures: wrong → gentle retry/hint, never game-over

---

## 2. Visual Direction (Art Director)

- **Theme directive:** Extend existing underwater theme for all 6 minigames
- **Color palette:** Reuse `--app-primary`, `--app-secondary`, `--app-correct`, `--app-wrong`, `--app-surface`. Optional extensions: `--app-gem` (#b39ddb), `--app-coral-accent` (#ff8a65) only if needed
- **Typography:** Existing playful stack (Nunito/Fredoka); number labels at 1.5–2rem min
- **Shapes:** Chunky, rounded, kid-friendly; no sharp edges or realistic/scary imagery
- **Icon style:** Flat SVG, consistent with existing assets/graphics/ directory
- **Background patterns:** Per-minigame scene compositions using existing gradient + overlays; no full-screen takeovers
- **Do:** Reuse existing SVGs, use design tokens, ensure 44px tap targets, test reduced motion
- **Don't:** Realistic imagery, flashing/flickering, gradients that bloat file size, tiny details

### Asset Budget

| Constraint | Limit |
|------------|-------|
| Per SVG | < 2 KB |
| Total new assets | < 80 KB |
| Target for initial placeholders | < 40 KB |

~20 new SVGs across 6 minigames + 1 shared scene background. Placeholders (simple geometric shapes at correct dimensions) are acceptable for v1.

---

## 3. UX Layout & Components (UX Designer)

- **Primary screens impacted:** `/play` (minigame rendering layer), all pages (Dutch copy)
- **Global shell structure:** No change to AppShell/NavTabs; minigames render within existing GameStageCard/play layout
- **Navigation model:** User does NOT choose minigame; system auto-selects via mapping table + random serving. "Choose game" in AppShell still opens PlayModeSelector for mode (classic/timed-pop/build-bridge); minigames are within modes.
- **Component catalog:**
  - `MinigameRenderer.vue` — dynamic component loader (lazy)
  - 6 minigame components (one per game)
  - `useI18n` composable for Dutch text

### Flow

```
Map → Play → [ProblemCard shown] → [Minigame Scene] → [Answer via interaction] → Feedback → Next
```

- ProblemCard remains canonical math display
- Minigame is the interaction wrapper for answering
- Fallback: if minigame fails to load, show Keypad

### Tap targets & accessibility

- All interactive elements ≥ 44px (48–56px preferred for kleuters)
- Spacing ≥ 8px between elements
- Keyboard: Tab through choices, Enter/Space to select, arrow keys where appropriate

---

## 4. Motion & Audio Rules (Motion/Audio)

### Animations per minigame

| Minigame | Animation | Duration | Easing |
|----------|-----------|----------|--------|
| Bubble Pop | Float up (translateY loop) | 2–3s loop | linear |
| Bubble Pop | Pop (scale+opacity) | ≤ 300ms | ease-out |
| Treasure Dive | Drag scale-up (1.05) | ≤ 200ms | ease-out |
| Treasure Dive | Chest open/close | ≤ 300ms | ease-out |
| Fish Feed | Pellet drop (translateY) | ~400ms | ease-out |
| Fish Feed | Fish eat pulse | ≤ 300ms | ease-out |
| Coral Builder | Piece place (scale bounce) | ≤ 300ms | cubic-bezier |
| Submarine Sort | Item slide to slot | ≤ 300ms | ease-out |
| Starfish Match | Match glow (box-shadow) | ≤ 300ms | ease-out |
| Starfish Match | Connection line draw-in | ≤ 400ms | ease-out |

### Reduced motion behavior

All animations collapse to instant state change under `prefers-reduced-motion: reduce`. Wrap in `@media (prefers-reduced-motion: no-preference)` or use global `--app-transition: 0s` override.

### Sound rules

- Reuse existing: correct, wrong, celebrate SFX via `useSound`
- Optional gentle "plop" for placement actions (reuse or skip for v1)
- No new audio files required initially

### CSS-only constraint

All animations via `@keyframes` or `transition`. No JS animation libraries.

---

## 5. Accessibility (UX + QA)

- **Keyboard model:** Every minigame playable via keyboard (Tab, Enter/Space, Arrow keys). Drag interactions have select-from-list fallback.
- **Focus states:** Visible on all interactive elements; existing focus ring tokens
- **Contrast:** WCAG AA on all text/backgrounds; use existing token system
- **Reduced motion:** Hard requirement; all animations respect prefers-reduced-motion. Timed minigames extend or disable timer under reduced motion.
- **Screen reader expectations:** aria-labels on game objects; `role="group"` for choice sets; decorative SVGs get `aria-hidden="true"`

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

### Type system

- `MinigameId` union type: `'bubble-pop' | 'treasure-dive' | 'fish-feed' | 'coral-builder' | 'submarine-sort' | 'starfish-match'`
- `MinigameDefinition`: id, component, requiredAssets, difficultyKnobs, a11yFallback
- `MinigameMap`: version + entries (direct or weighted pool per level range)
- `DifficultyProgression`: math ranges per chapter + minigame params per chapter

### Composables

| Composable | Purpose |
|------------|---------|
| `useMinigame` | Registry + resolution (id → component) |
| `useMinigameServing` | Shuffle bag, no-repeat window, seed |
| `useDifficultyProgression` | Math ranges + minigame params from level/chapter |
| `useI18n` | Dutch text lookup from nl.json |

### Where things live

- Types: `apps/web/types/minigame.ts`, `apps/web/types/difficulty.ts`
- Composables: `apps/web/composables/useMinigame.ts`, etc.
- Components: `apps/web/components/minigames/`
- Content: `apps/web/content/minigame-map.v1.json`, `apps/web/content/locales/nl.json`
- Assets: `apps/web/assets/graphics/minigames/{name}/`

### Core loop integration

1. `usePlayGame` generates question (unchanged)
2. `useMinigameServing.pick(levelId, seed)` selects minigameId
3. `MinigameRenderer` resolves component via `useMinigame`
4. Minigame receives `question` + `onAnswer`, calls `onAnswer(choice)` on user action
5. `usePlayGame.selectAnswer` validates and updates score/feedback

### i18n architecture

- Source of truth: `apps/web/content/locales/nl.json` (flat or nested key-value)
- `useI18n()` → `{ t(key, params?): string }` with interpolation
- Static import at build time; no runtime fetch
- ESLint rule: `no-hardcoded-ui-strings` for templates/components
- Dutch only for Epic 21; structure allows future locales

### Performance

- Lazy-load minigame components via `defineAsyncComponent`
- Bundle budget: minigame chunks excluded from initial load
- Static content: zero network for minigame/i18n data

---

## 7. Test Strategy & Regression Plan (QA Strategist)

### Unit tests

- `useMinigameServing`: seed determinism, no-repeat window, bag exhaustion/refill
- `useDifficultyProgression`: math ranges per chapter, edge cases
- `useI18n`: all keys resolve, interpolation, missing key fallback
- Mapping table validation: all levelIds → valid minigameIds

### E2E (Playwright, container-only: `docker compose run --rm e2e`)

- Smoke: each minigame renders, interaction works, answer submits
- Flow: map → play → minigame → complete → map
- Dutch copy: no English strings visible on key pages
- Visual regression: screenshot baselines per minigame

### Non-flaky assertions

- Use `data-testid` for element presence; avoid timing-dependent checks
- Deterministic seeds for reproducible sequences
- Stable selectors: prefer `data-testid`, `aria-label`

---

## 8. Security/Privacy Notes (Security/Privacy)

- **New risks:** None (LOW overall). Client-side only; no new API endpoints.
- **Config constraints:** Static JSON content files; no eval, no dynamic scripts
- **Data handling:** No new data collection; localStorage unchanged; no new identifiers
- **Auth/crypto/payments:** Not involved
- **Verdict:** Standard Gate D checks sufficient; no additional security artifacts required

---

## 9. Slice Map (Orchestrator)

### Epic 21.1 — i18n Foundation + Dutch UI Copy
- **Visual milestone:** Every user-visible string across all pages is in Dutch; no English leaks
- **Files/modules:** `content/locales/nl.json`, `composables/useI18n.ts`, all 7 pages, all components with English strings, ESLint config
- **Acceptance:** 100% Dutch visible UI; lint gate catches new English; E2E verifies key pages

### Epic 21.2 — Minigame Types + Serving + Difficulty Foundation
- **Visual milestone:** MinigameRenderer wired into play flow; serving picks minigame per round (visible in dev tools or via test)
- **Files/modules:** `types/minigame.ts`, `types/difficulty.ts`, `composables/useMinigame.ts`, `useMinigameServing.ts`, `useDifficultyProgression.ts`, `content/minigame-map.v1.json`, `components/minigames/MinigameRenderer.vue`
- **Acceptance:** Types clean; serving deterministic with seed; difficulty scales per chapter; MinigameRenderer loads with fallback

### Epic 21.3 — First 2 Minigames (Bubble Pop + Treasure Dive)
- **Visual milestone:** Playing a level shows Bubble Pop (tap) or Treasure Dive (drag) as the interaction
- **Files/modules:** `MinigameBubblePop.vue`, `MinigameTreasureDive.vue`, SVG placeholder assets, unit + E2E tests
- **Acceptance:** Both minigames render, accept answer, integrate with core loop; keyboard playable; reduced motion

### Epic 21.4 — Middle 2 Minigames (Fish Feed + Coral Builder)
- **Visual milestone:** Fish Feed (timed tap) and Coral Builder (scene tap) appear during play sessions
- **Files/modules:** `MinigameFishFeed.vue`, `MinigameCoralBuilder.vue`, SVG placeholder assets, unit + E2E tests
- **Acceptance:** Both minigames render, interact, submit answer; difficulty knobs wired; a11y

### Epic 21.5 — Final 2 Minigames (Submarine Sort + Starfish Match)
- **Visual milestone:** All 6 minigames available; full variety in play sessions
- **Files/modules:** `MinigameSubmarineSort.vue`, `MinigameStarfishMatch.vue`, SVG placeholder assets, unit + E2E tests
- **Acceptance:** Both render + interact; all 6 minigames in serving rotation; no-repeat window working

### Epic 21.6 — Integration, Polish & a11y Hardening
- **Visual milestone:** Complete polished flow: map → play (varied minigames) → complete → map, all in Dutch
- **Files/modules:** play.vue integration, visual regression baselines, a11y audit, performance verification
- **Acceptance:** Full flow E2E green; visual baselines committed; WCAG AA contrast; reduced motion verified; bundle budget passes
