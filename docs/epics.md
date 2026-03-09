# Epics

> Run with: /run-epics
> Each epic uses /feature --ci --max-tasks=5 (default FORCE autopilot).
> Pipeline: plan -> tasks -> execute -> finalize -> wait for manual merge -> epics update (PR, merge commit) -> sync main -> next epic.

## Epic 2 — Skin System + 1 Skin
- [x]
/feature --ci --max-tasks=5
Build Epic 2: Minigame Skin System (rendering layer) + implement ONE skin (Monster Feed).
Requirements:
- Skin contract (TS) for rendering a round + callbacks
- core loop remains single source of truth (no duplicated logic)
- /play switches skin via query/config (default classic)
- implement ONE skin: Monster Feed (minimal UI, accessible)
- tests: skin selection + contract/callback correctness
- keep existing smoke/e2e green (update lightly if needed)

## Epic 3 — More Skins + Rewards
- [x]
/feature --ci --max-tasks=5
Build Epic 3: Add 2 additional skins + simple rewards.
Requirements:
- add 2 skins reusing Skin contract
- add simple rewards/unlocks (local-only; minimal UI)
- a11y stays correct, bundle stays within budget
- tests for unlock logic and skin switching

## Epic 4 — Persistence (Local) + Optional API Telemetry
- [x]
/feature --ci --max-tasks=5
Build Epic 4: Persistence + optional telemetry.
Requirements:
- persist progress locally (localStorage) with versioning/migration
- optional: API endpoint to log anonymous session stats (no auth)
- privacy notes and opt-out switch
- tests for persistence schema/versioning

## Epic 5 — Polish / Hardening
- [x]
/feature --ci --max-tasks=5
Build Epic 5: Polish, accessibility, reliability, performance hardening.
Requirements:
- a11y pass for /play (keyboard/focus states)
- reduce flakiness in e2e; improve error states
- perf: keep within budgets; remove unnecessary deps
- docs: quick start + runbooks updated

## Epic 6 — Game Modes Framework + 1 New Mode
- [x]
/feature --ci --max-tasks=5
Build Epic 6: Game Modes framework + timed-pop mode.
Requirements:
- GameMode contract (InteractionModeId, ModeDefinition)
- /play?mode=classic (default), /play?mode=timed-pop
- Timed-pop: mild timer, friendly timeout, no fail state
- a11y: keyboard playable, timer does not block
- Tests: mode selection, recordTimeout, timer (fake)
- Smoke extended for mode switch


## Epic 7 — Second Mode (Drag & Drop) + Mode Selector UI
- [x]
/feature --ci --max-tasks=5  
Build Epic 7: Add a second game mode using drag & drop interaction and a kid-friendly mode selector UI.

Requirements:
- Implement mode selector UI (big buttons with icons) reachable from `/play`:
  - choose Mode + optionally Skin
  - remember last selection (local)
- Add ONE additional mode: **build-bridge** (drag/drop)
  - Show a gap/bridge and planks labeled with answers (or draggable tiles)
  - Player drags the correct plank/tile into place
  - Friendly feedback, no fail state; on wrong: gentle hint
- Keep core loop as source of truth; mode only changes interaction pattern.
- Accessibility:
  - Must still be playable without drag support:
    - keyboard alternative (select + place)
- Tests:
  - mode selector routing + persistence
  - build-bridge logic deterministic with fake timers/DOM events
- E2E:
  - smoke covers switching to build-bridge and completing one round

Non-goals:
- more than 2 modes total
- new operators

---

## Epic 8 — Content Packs per Mode + Pacing Rules
- [x]
/feature --ci --max-tasks=5  
Build Epic 8: Introduce content packs per mode plus pacing rules to keep sessions varied and frustration-free.

Requirements:
- Extend level schema to support:
  - `modeId` applicability (classic/timed-pop/build-bridge)
  - pacing tags (easy/normal/challenge), optional hint defaults
- Provide content packs:
  - `levels.classic.v1.json`
  - `levels.timed-pop.v1.json`
  - `levels.build-bridge.v1.json`
- Add pacing engine:
  - mix easy/normal/challenge in a predictable pattern
  - never cluster “hard” items back-to-back for kleuters
- Determinism:
  - same seed => same sequence per mode
- Tests:
  - pacing invariants
  - pack schema validation
- E2E:
  - verify pack mode works for all modes without regressions

Non-goals:
- adaptive learning (that’s later)
- backend content management

---

## Epic 9 — Adaptive Assistance (Hints, Anti-Guessing, Confidence Gate)
- [x]
/feature --ci --max-tasks=5  
Build Epic 9: Add adaptive assistance so kids don’t get stuck or spam-guess.

Requirements:
- Add “confidence gate” + anti-guessing:
  - after 2 wrong answers: reveal hint (dot visuals / number line)
  - after repeated wrong: reduce choice count temporarily (optional)
- Add hint modes:
  - dots, number line, grouping visual
- Add gentle pacing interventions:
  - if child struggles, auto-switch to easier tag for a few rounds
- Persist assistance state locally (per child profile if available)
- Tests:
  - deterministic assistance triggers
  - ensure no infinite loops / no hard fail states
- UX:
  - feedback stays positive; no negative scoring

Non-goals:
- full personalization ML
- parental dashboards

---

## Epic 10 — Child Profiles (Local) + Parent Gate
- [x]
/feature --ci --max-tasks=5  
Build Epic 10: Add local child profiles so multiple kids can use the same device, with a simple parent gate.

Requirements:
- Local profiles:
  - name/avatar selection (simple)
  - per-profile progress, unlocked rewards, last mode/skin
- Parent gate:
  - “hold for 3 seconds” or simple arithmetic check for settings access
- Settings per profile:
  - difficulty ceiling (10/20)
  - hints on/off (default on)
- Tests:
  - storage versioning/migration per profile
  - parent gate behavior
- UX:
  - large tap targets, minimal reading

Non-goals:
- accounts/login
- cloud sync

---

## Epic 11 — Audio & Micro-Animations (Optional Toggle)
- [x]
/feature --ci --max-tasks=5  
Build Epic 11: Add optional sound effects and micro-animations to make the game more playful.

Requirements:
- Sound:
  - tiny SFX pack (correct/wrong/celebrate)
  - global toggle + remember per profile
  - never block gameplay if audio fails
- Animations:
  - subtle motion on correct answer
  - gentle shake on wrong (non-punitive)
- Performance:
  - keep bundle within budget (lazy-load audio)
- Accessibility:
  - respect reduced motion preference
- Tests:
  - settings persistence
  - reduced-motion behavior

Non-goals:
- background music
- heavy animation libraries

---

## Epic 12 — Rewards Expansion (Sticker Book, Daily Goal)
- [x]
/feature --ci --max-tasks=5  
Build Epic 12: Expand rewards into a sticker book and optional daily goal.

Requirements:
- Sticker book UI:
  - pages, categories, “new sticker” highlight
- Daily goal (optional):
  - “play 5 rounds” reward
  - timezone-safe local calculation
- Persist rewards per profile
- Tests:
  - daily reset logic
  - reward unlocking rules
- UX:
  - celebratory but short; never blocks play

Non-goals:
- monetization
- leaderboards

---

## Epic 13 — Share/Print Progress Summary (Parent-friendly, Local)
- [x]
/feature --ci --max-tasks=5  
Build Epic 13: Provide a parent-friendly local summary screen (no accounts).

Requirements:
- Summary:
  - rounds played, accuracy trend (simple), favorite mode
- Export:
  - local “copy to clipboard” or “download JSON” (optional)
- Privacy:
  - no identifiers, local-only by default
- Tests:
  - summary aggregation correctness

Non-goals:
- cloud sync
- analytics dashboards

---

## Epic 14 — Production Hardening 2 (DAST, Security Regression, CI Speed)
- [x]
/feature --ci --max-tasks=5  
Build Epic 14: Strengthen security/testing hardening and CI speed.

Requirements:
- extend OWASP ZAP baseline coverage
- add regression tests for security headers/cookies/CORS
- add CI caching improvements (pnpm/composer) without weakening integrity
- reduce flaky e2e further
- docs/runbooks update

Non-goals:
- feature work

---

## Epic 15 — Release Prep (UX pass, Copy pass, Bug bash automation)
- [x]
/feature --ci --max-tasks=5  
Build Epic 15: Prepare for release-quality UX and stability.

Requirements:
- UX pass:
  - tap target sizing audit
  - color/contrast audit
  - reduced reading mode
- Copy pass:
  - friendly microcopy
- Bug bash:
  - add a “test checklist” doc + quick scripts
- Performance:
  - verify budgets and optimize

Non-goals:
- new modes/skins

---

## Epic 16 — Release Prep (UX Pass, Copy Pass, Bug Bash Automation)
- [x]
/feature --ci --max-tasks=5
Build Epic 16: Prepare for release-quality UX and stability.

Requirements:
- UX pass:
  - tap target sizing audit
  - color/contrast audit
  - reduced reading mode
- Copy pass:
  - friendly microcopy
- Bug bash:
  - add a "test checklist" doc + quick scripts
- Performance:
  - verify budgets and optimize

Non-goals:
- new modes/skins

---

## Epic 17 — Graphics v1
- [x]
/feature --ci --max-tasks=5
Build Epic 17 (Graphics v1): create a truly kid-friendly GRAPHICAL minigame (not a styled form).

Definition of "graphical" (non-negotiable):
- The interaction must be primarily visual and spatial (drag/drop or tap-on-objects), not just text buttons.
- The screen must look like a game scene with background + character/objects.
- Answer choices must be rendered as game objects (e.g., planks), not plain buttons with borders.

Scope:
- Planning: art-direction.md, game-feel.md, motion-audio.md, assets.md
- Assets pipeline + SceneLayout
- Graphical build-bridge: scene, game objects, wrong-drop wobble, hint after 2 wrong
- Reduced motion support
- Unit tests + smoke update

Non-goals:
- multiple new graphical modes
- high-fidelity art packs

---

## Epic 18 — Global Kid-Friendly Look & Feel v2
- [x]
/feature --ci --max-tasks=5
Build Epic 18: Transform the entire app (not just the minigame) into a playful kindergarten-friendly look-and-feel.

Goal:
Make every page feel like a game by removing the "white document" look and unifying layout, typography, navigation, and feedback across the whole app.

Scope (implemented):
- App shell: playful background, stage card, top bar (profile pill, Choose game), nav as big icon-tabs
- Design tokens: colors, typography, radii, spacing, shadows
- Shared components: AppShell, NavTabs, PrimaryButton, SecondaryButton, StatPill, GameStageCard
- Page migration: index, start, play, stickers, summary, settings
- Smoke UI regression: AppShell nav tabs and stage documented

Merged: PR #40

---

## Epic 19.1 — Tokens & No-White
- [x]
PlanRef:
- design: docs/design/epic-19.md
- archive: artifacts/archive/epic-19.0/latest
- slice: 19.1

/feature --ci --max-tasks=5
Build Epic 19.1: Replace white app look with underwater design tokens.

Requirements:
- Update tokens.css: underwater palette (deep water gradient bg, no #ffffff surfaces)
- Update graphics.css: underwater-themed graphics tokens
- GameStageCard: use themed surface (glass/teal, not white)
- app.vue: ensure root uses new --app-bg
- Remove hardcoded #fff, #ffffff from dominant surfaces
- Keep --app-tap-min, focus states, reduced motion
- Tests: typecheck, build, smoke green

Acceptance:
- No white (#fff/#ffffff) as primary surface anywhere
- App background is underwater gradient
- Stage card has themed (non-white) surface

---

## Epic 19.2 — Shell & Nav Redesign
- [x]
PlanRef:
- design: docs/design/epic-19.md
- archive: artifacts/archive/epic-19.0/latest
- slice: 19.2

/feature --ci --max-tasks=5
Build Epic 19.2: New app shell and nav tabs with underwater theme and playful typography/iconography.

Requirements:
- AppShell: underwater background pattern, themed top bar (profile pill, Choose game)
- GameStageCard: integrate with new tokens from 19.1
- NavTabs: replace emoji icons with underwater SVG icons (fish, chart/bubbles, gear/coral)
- Add assets/graphics/icons/ for nav SVGs
- Playful typography (Nunito or Fredoka One) applied consistently
- Keep a11y: 44px tap targets, focus states
- Tests: typecheck, build, smoke (nav tabs work)

Acceptance:
- Nav shows SVG icons instead of emoji
- Shell has underwater-themed background
- Typography is playful and consistent

---

## Epic 19.3 — Underwater Asset Pipeline
- [x]
PlanRef:
- design: docs/design/epic-19.md
- archive: artifacts/archive/epic-19.0/latest
- slice: 19.3

/feature --ci --max-tasks=5
Build Epic 19.3: Add 10+ underwater SVG assets and background patterns.

Requirements:
- Add 10+ underwater SVGs: fish, bubbles, seaweed, coral, shells, etc.
- Add background patterns (bubble pattern, wave overlay)
- Organize in assets/graphics/backgrounds/, objects/, icons/
- Integrate patterns into AppShell and/or SceneLayout
- Each SVG target < 2KB; total new assets < 50KB
- Bundle size budget must pass
- Tests: typecheck, build

Acceptance:
- At least 10 underwater-themed SVG assets in repo
- Background patterns visible on at least one screen
- Bundle budget passes

---

## Epic 19.4 — Page Unification
- [x]
PlanRef:
- design: docs/design/epic-19.md
- archive: artifacts/archive/epic-19.0/latest
- slice: 19.4

/feature --ci --max-tasks=5
Build Epic 19.4: Unify all pages visually with underwater theme.

Requirements:
- index, start, play, stickers, summary, settings: all use themed shell and tokens
- Remove any remaining hardcoded colors (e.g. play page skin picker, privacy footer)
- ProfileSelector, PlayModeSelector: themed
- Ensure visual consistency across all routes
- Tests: typecheck, build, smoke all pages

Acceptance:
- Every page (/, /start, /play, /stickers, /summary, /settings) looks unified
- No orphaned white or off-theme elements

---

## Epic 19.5 — Polish & a11y
- [x]
PlanRef:
- design: docs/design/epic-19.md
- archive: artifacts/archive/epic-19.0/latest
- slice: 19.5

/feature --ci --max-tasks=5
Build Epic 19.5: Final polish, a11y audit, reduced motion verification.

Requirements:
- Contrast audit: WCAG AA on all text/background combinations
- Reduced motion: verify all transitions respect prefers-reduced-motion
- Focus states visible on all interactive elements
- Document a11y notes in design bible if needed
- Tests: typecheck, build, smoke, manual a11y check

Acceptance:
- Contrast meets WCAG AA
- Reduced motion preference disables non-essential animations
- Focus states visible

---

## Epic 20.1 — Playwright & Tokens Foundation
- [x]
Merged: PR #49
PlanRef:
- design: docs/design/epic-20.md
- archive: artifacts/archive/epic-20.0/latest
- slice: 20.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 20.1: Playwright foundation + design tokens + data model for level map UI.

Requirements:
- Create `apps/web/playwright.config.ts` (testDir: e2e, baseURL from env, visual project, container-aware)
- Create `apps/web/e2e/smoke.spec.ts` — basic smoke: navigate to /, /play, verify page loads
- Add new design tokens to `tokens.css`: `--app-map-path`, `--app-map-path-edge`, `--app-node-unlocked`, `--app-node-locked`, `--app-keypad-key`, `--app-keypad-key-active`, easing tokens
- Create `useLevelProgress` composable (read/write `levelProgress`, `currentLevel` in ProfileProgress)
- Create `useMistakes` composable (session-only mistake collection)
- Extend `ProfileProgress` schema with `levelProgress?: Record<number, { stars: number }>`, `currentLevel?: number`
- Unit tests for `useLevelProgress`, `useMistakes`
- Playwright must run container-only: `docker compose run --rm e2e`

Acceptance:
- `docker compose run --rm e2e pnpm exec playwright test` passes with smoke test
- New tokens exist in tokens.css
- Composables have passing unit tests
- ProfileProgress schema accepts levelProgress and currentLevel

Screenshot targets:
- Smoke test passes (infrastructure proof)

---

## Epic 20.2 — Level Map Screen
- [x]
Merged: PR #50
PlanRef:
- design: docs/design/epic-20.md
- archive: artifacts/archive/epic-20.0/latest
- slice: 20.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 20.2: Level map page with winding path, nodes, avatar, and Play CTA.

Requirements:
- Create `pages/map.vue` — level map page within AppShell (no GameStageCard wrapper)
- Create `components/map/MapPath.vue` — SVG winding path with draw-in animation (stroke-dasharray)
- Create `components/map/MapNode.vue` — circular node (locked/unlocked/completed states, star/lock icons, level number)
- Create `components/map/MapAvatar.vue` — avatar bubble at current node position
- Add star.svg and lock.svg to `assets/graphics/icons/`
- Update NavTabs to include Map tab (or update index page to link to /map)
- Big "Play" CTA navigates to `/play?level=N&source=pack`
- Auto-scroll to current node on mount
- Nodes use `useLevelProgress` for state
- Reduced motion: path visible immediately, no pulse
- Keyboard: Tab through unlocked nodes, Enter/Space to select
- E2E: `e2e/map.spec.ts` — map loads, path visible, nodes rendered, Play navigates
- Visual: `e2e/visual/map-visual.spec.ts` — screenshot baseline

Acceptance:
- /map renders winding path with level nodes (locked/unlocked/completed)
- Avatar displayed at current node
- Play CTA navigates to /play with level param
- No plain white background
- Playwright screenshot captured for map page
- Keyboard navigable

Screenshot targets:
- Full map page with path and nodes
- Node states (locked, current, completed with stars)

---

## Epic 20.3 — Play Screen Redesign (Keypad + ProblemCard)
- [x]
Merged: PR #51
PlanRef:
- design: docs/design/epic-20.md
- archive: artifacts/archive/epic-20.0/latest
- slice: 20.3
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 20.3: Replace multiple-choice with numeric keypad and big problem card.

Requirements:
- Create `components/play/ProblemCard.vue` — large `a + b = ?` display (2.5rem), themed card
- Create `components/play/Keypad.vue` — 0-9 digit grid + Clear + Check; builds answer string; submits via onAnswer(number)
- Integrate Keypad + ProblemCard into `play.vue` (replace SkinClassic choice buttons for keypad mode)
- Support `?level=N` query param to start at specific pack index
- Play header: score (StatPill), progress indicator (e.g., "3/5")
- Keypad: max 2 digits, Check disabled when empty, visual press feedback (scale 0.95)
- Feedback: correct/wrong still works with keypad input
- Answer display area between problem and keypad (large, centered)
- Keyboard accessible: Tab through keys, Enter/Space to press, number keys work directly
- E2E: `e2e/play.spec.ts` — keypad visible, enter answer, submit, feedback appears
- Visual: `e2e/visual/play-visual.spec.ts` — screenshot baseline

Acceptance:
- /play shows ProblemCard + Keypad instead of multiple-choice buttons
- Keypad input works (type digits, clear, check)
- Correct/wrong feedback displays after submission
- No multiple-choice buttons visible
- Keyboard playable (Tab, Enter, number keys)
- Playwright screenshot captured

Screenshot targets:
- Play page with problem card + keypad
- Feedback state (correct answer)

---

## Epic 20.4 — Level Complete Modal + Confetti
- [x]
Merged: PR #52
PlanRef:
- design: docs/design/epic-20.md
- archive: artifacts/archive/epic-20.0/latest
- slice: 20.4
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 20.4: Level complete celebration with modal, stars, mascot, confetti.

Requirements:
- Create `components/modals/LevelCompleteModal.vue` — mascot, 1-3 stars (staggered reveal), message, "Next" CTA
- Create `components/effects/Confetti.vue` — CSS-only confetti (24-32 particles, multiple keyframe variants)
- Create `assets/graphics/characters/mascot.svg` — friendly underwater character (flat, rounded, happy)
- Level complete trigger: detect last problem of level in pack mode, show modal
- Stars computed from session mistakes (0 wrong = 3, 1 wrong = 2, 2+ wrong = 1)
- Confetti only for 2+ stars; reduced-motion: disabled or static sparkles
- Modal: `Teleport` to body, `role="dialog"`, `aria-modal="true"`, focus trap
- Escape key closes modal
- "Next" CTA: navigates to next level or back to /map (if last level)
- "Review Mistakes" secondary CTA when session has errors
- Sound: `playCelebrate()` when modal opens
- Star animation: scale 0→1 with bounce easing, 150ms stagger
- E2E: `e2e/level-complete.spec.ts` — modal appears, mascot visible, stars visible, Next works
- Visual: screenshot of modal

Acceptance:
- Level complete modal appears after finishing level
- Mascot and stars displayed (star count matches accuracy)
- Confetti plays for 2+ stars (respects reduced-motion)
- Next CTA advances to next level or map
- Focus trapped in modal
- Playwright screenshot captured

Screenshot targets:
- Level complete modal (3 stars)
- Level complete modal (1 star, no confetti)

---

## Epic 20.5 — Mistakes Review + Polish
- [x]
Merged: PR #53
PlanRef:
- design: docs/design/epic-20.md
- archive: artifacts/archive/epic-20.0/latest
- slice: 20.5
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 20.5: Friendly mistakes review and final polish pass.

Requirements:
- Create `components/review/MistakesReview.vue` — card-based list per mistake (problem, child's answer, correct answer, optional HintDots)
- Mascot encouragement header ("Laten we deze nog eens bekijken!")
- Cards: slide-in animation (staggered), themed surface, no red X marks
- CTAs: "Opnieuw proberen" (retry level), "Naar de kaart" (back to map)
- Integrate with useMistakes composable — show after level complete when errors exist
- Level progress persistence: save stars to ProfileProgress.levelProgress after level complete
- Update map to reflect saved progress on return
- Accessibility audit: keyboard nav across all new screens, contrast check (WCAG AA), focus states
- Reduced motion: verify all animations degrade properly
- Visual regression baselines: update/capture for all 4 screens (map, play, level-complete, mistakes)
- E2E: `e2e/mistakes-review.spec.ts` — review shows after errors, cards displayed, CTAs work
- Visual: final screenshot baselines committed

Acceptance:
- Mistakes review shows friendly card per wrong answer
- HintDots or visual aid on each mistake card
- Level progress persists (stars saved, map reflects on return)
- All screens pass contrast check (WCAG AA)
- Reduced motion disables non-essential animations
- All visual regression baselines committed and CI passes
- No plain white surfaces anywhere

Screenshot targets:
- Mistakes review with 2+ mistake cards
- Map page showing completed levels with stars
- Full app flow proof (map → play → complete → review → map)

---

## Epic 21.1 — i18n Foundation + Dutch UI Copy
- [x]
Merged: PR #58
PlanRef:
- design: docs/design/epic-21.md
- archive: artifacts/archive/epic-21.0/latest
- slice: 21.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 21.1: Create Dutch i18n infrastructure and replace all English UI strings with Dutch.

Requirements:
- Create `apps/web/content/locales/nl.json` as single source of truth for all UI text (Dutch only)
- Create `apps/web/composables/useI18n.ts` composable: `t(key, params?)` lookup with interpolation support; returns key as fallback if missing
- Replace all hardcoded English strings across all 7 pages (index, start, map, play, summary, stickers, settings)
- Replace all hardcoded English strings in components (AppShell, NavTabs, LevelCompleteModal, MistakesReview, ProblemCard, PlayModeSelector, ParentGate, Keypad, ProfileSelector, ProfileCreate, StatPill, GameStageCard, rewardsConfig labels)
- Add ESLint rule or lint script: `no-hardcoded-ui-strings` that flags English literal strings in Vue templates/components
- Tests:
  - Unit: useI18n key resolution, interpolation, missing key fallback
  - E2E: verify no English visible on /map, /play, /settings pages
- Keep all existing functionality identical; only text changes

Acceptance:
- 100% of visible UI strings come from nl.json via useI18n
- ESLint rule or lint script catches new hardcoded English strings
- E2E confirms Dutch text on key pages
- No English text visible anywhere in the app
- Typecheck clean, build passes, bundle budget passes

---

## Epic 21.2 — Minigame Types + Serving + Difficulty Foundation
- [x]
Merged: PR #59
PlanRef:
- design: docs/design/epic-21.md
- archive: artifacts/archive/epic-21.0/latest
- slice: 21.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 21.2: Create minigame type system, serving infrastructure, difficulty progression, and MinigameRenderer.

Requirements:
- Create `apps/web/types/minigame.ts`: MinigameId union type (6 values), MinigameDefinition interface, MinigameMap schema (direct + weighted pool entries)
- Create `apps/web/types/difficulty.ts`: DifficultyProgression interface (math ranges per chapter + minigame params)
- Create `apps/web/composables/useMinigame.ts`: registry (MinigameId → MinigameDefinition), resolution from map
- Create `apps/web/composables/useMinigameServing.ts`: shuffle-bag algorithm, no-repeat window (configurable N), deterministic seed via createSeededRng
- Create `apps/web/composables/useDifficultyProgression.ts`: compute operandMin/Max/choiceCount from chapter + minigame-specific params from level index
- Create `apps/web/content/minigame-map.v1.json`: mapping table with entries for level ranges → minigameId or weighted pools
- Create `apps/web/components/minigames/MinigameRenderer.vue`: dynamic component loader via defineAsyncComponent; props: question, minigameId, onAnswer, difficultyParams; handles loading/error/a11y fallback
- Tests:
  - Unit: useMinigameServing (deterministic seed, no-repeat, bag exhaustion/refill), useDifficultyProgression (range scaling, edge cases), mapping table validation
  - MinigameRenderer renders fallback when component not yet available
- Typecheck clean, build passes

Acceptance:
- All types compile cleanly
- Same seed produces identical minigame sequence across runs
- No-repeat window prevents consecutive same minigame
- Difficulty scales correctly per chapter (verified by unit tests)
- MinigameRenderer loads dynamically and shows fallback on error
- minigame-map.v1.json validates against schema

---

## Epic 21.3 — First 2 Minigames (Bubble Pop + Treasure Dive)
- [x]
Merged: PR #60
PlanRef:
- design: docs/design/epic-21.md
- archive: artifacts/archive/epic-21.0/latest
- slice: 21.3
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 21.3: Implement Bubble Pop (tap) and Treasure Dive (drag) minigames with SVG placeholders.

Requirements:
- Create `apps/web/components/minigames/MinigameBubblePop.vue`:
  - Receives question (AdditionQuestion) + onAnswer callback
  - Renders floating bubbles with numbers (correct + distractors from question.choices)
  - Tap/click correct bubble → calls onAnswer(correctAnswer)
  - CSS float animation (translateY); pop animation (scale+opacity)
  - Keyboard: focusable bubbles, Enter/Space to select
  - Reduced motion: no float, instant state change
  - Difficulty params: bubbleCount, floatSpeed
- Create `apps/web/components/minigames/MinigameTreasureDive.vue`:
  - Receives question + onAnswer
  - Renders gems/shells with numbers; drag correct one into treasure chest
  - Drag via pointer events (touch+mouse); generous drop zone hitbox
  - Keyboard fallback: Tab through items, Enter to select (no drag required)
  - CSS drag feedback (scale-up 1.05), chest open/close
  - Reduced motion: no animations, instant placement
  - Difficulty params: gemCount
- Create SVG placeholder assets in `assets/graphics/minigames/bubble-pop/` and `treasure-dive/`
- Register both in useMinigame registry
- Wire into play.vue flow via MinigameRenderer
- Tests:
  - Unit: both components render, accept props, call onAnswer with correct value
  - E2E: play a round with each minigame, verify answer submission and feedback
- Dutch labels via useI18n (from 21.1)

Acceptance:
- Bubble Pop renders bubbles, tap submits answer, feedback shows
- Treasure Dive renders items, drag (or keyboard select) submits answer
- Both keyboard-playable
- Reduced motion respected
- SVG assets < 2KB each
- E2E passes with both minigames
- Typecheck clean, bundle budget passes

---

## Epic 21.4 — Middle 2 Minigames (Fish Feed + Coral Builder)
- [x]
Merged: PR #61
PlanRef:
- design: docs/design/epic-21.md
- archive: artifacts/archive/epic-21.0/latest
- slice: 21.4
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 21.4: Implement Fish Feed (timed scene) and Coral Builder (scene/tap) minigames.

Requirements:
- Create `apps/web/components/minigames/MinigameFishFeed.vue`:
  - Receives question + onAnswer
  - Pellets with numbers; tap correct pellet to feed fish
  - Optional gentle timer (timerSeconds from difficulty params); timer disabled/extended under reduced motion
  - Fish eat animation on correct; pellet bounce on wrong
  - Keyboard: Tab through pellets, Enter to select
  - No punitive timeout: time expires → reveal answer gently
- Create `apps/web/components/minigames/MinigameCoralBuilder.vue`:
  - Receives question + onAnswer
  - Coral pieces with numbers appear; tap correct piece to attach to reef
  - Place animation (scale bounce); wrong piece returns with gentle hint
  - Keyboard: Tab through pieces, Enter to select
  - Difficulty: pieceCount, pieceRevealDelay
- Create SVG placeholder assets in `assets/graphics/minigames/fish-feed/` and `coral-builder/`
- Register both in useMinigame registry
- Tests:
  - Unit: components render, timer logic (fake timers), onAnswer called correctly
  - E2E: play round with each minigame
- Dutch labels via useI18n

Acceptance:
- Fish Feed renders, timer works (gentle), pellet tap submits answer
- Coral Builder renders, tap places piece, answer submits
- Timer respects reduced motion (disabled or extended)
- Both keyboard-playable
- SVG assets < 2KB each
- E2E passes
- Typecheck clean, bundle budget passes

---

## Epic 21.5 — Final 2 Minigames (Submarine Sort + Starfish Match)
- [x]
Merged: PR #62
PlanRef:
- design: docs/design/epic-21.md
- archive: artifacts/archive/epic-21.0/latest
- slice: 21.5
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 21.5: Implement Submarine Sort (drag) and Starfish Match (tap/timed) minigames.

Requirements:
- Create `apps/web/components/minigames/MinigameSubmarineSort.vue`:
  - Receives question + onAnswer
  - Submarine with compartments; drag correct item into correct compartment
  - Keyboard fallback: select item + compartment via Tab/Enter
  - Slide animation into slot; wrong item returns
  - Difficulty: compartmentCount, itemCount
- Create `apps/web/components/minigames/MinigameStarfishMatch.vue`:
  - Receives question + onAnswer
  - Grid of starfish pairs; tap pair whose numbers sum to correctAnswer
  - Match glow + connection line on correct; selection clears on wrong
  - Optional gentle timer; extended/disabled under reduced motion
  - Keyboard: Tab through pairs, Enter to select
  - Difficulty: pairCount, timerSeconds
- Create SVG placeholder assets in `assets/graphics/minigames/submarine-sort/` and `starfish-match/`
- Register both in useMinigame registry
- Update minigame-map.v1.json: all 6 minigames now available in weighted pools
- Tests:
  - Unit: both components, drag/select logic, timer (fake)
  - E2E: play round with each; verify all 6 minigames in rotation
- Verify no-repeat window working across full 6-minigame pool

Acceptance:
- Submarine Sort renders, drag/select submits answer
- Starfish Match renders, pair selection submits answer
- All 6 minigames available in serving rotation
- No-repeat window prevents immediate repetition
- Both keyboard-playable, reduced motion respected
- SVG assets < 2KB each
- E2E passes with all 6 minigames
- Typecheck clean, bundle budget passes

---

## Epic 21.6 — Integration, Polish & a11y Hardening
- [x]
PlanRef:
- design: docs/design/epic-21.md
- archive: artifacts/archive/epic-21.0/latest
- slice: 21.6
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 21.6: Full integration, accessibility audit, visual regression, and performance verification.

Requirements:
- Full flow integration: map → play (with minigame rotation) → level complete → map
  - Verify minigame variety in a 5+ round session (≥2 distinct minigames)
  - Verify difficulty params increase across chapters
  - Verify Dutch copy throughout the entire flow (no English leaks)
- Accessibility audit:
  - Keyboard navigation through all 6 minigames
  - Contrast check (WCAG AA) on all minigame elements
  - Focus states visible on all interactive elements
  - Reduced motion: verify all animations degrade (spot-check each minigame)
- Visual regression baselines:
  - Screenshot baseline for each of the 6 minigames (initial state)
  - Screenshot of play page with ProblemCard + active minigame
  - All baselines committed for CI
- Performance:
  - Bundle budget (Gate F) must pass
  - Lazy-loaded minigame chunks verified (not in initial bundle)
  - Total new SVG assets < 80KB
- E2E:
  - Full flow test: map → play → 5 rounds with minigame variety → level complete → map
  - Dutch copy verification on all pages
  - Visual regression test suite

Acceptance:
- Full map → play → minigame → complete flow works end-to-end
- ≥2 distinct minigames appear in a 5-round session
- All 6 minigames keyboard-playable
- WCAG AA contrast passes
- Reduced motion verified on all minigames
- Visual regression baselines committed and CI passes
- Bundle budget passes; lazy-load verified
- No English text visible anywhere
- All E2E tests green

---

## Epic 22.1 — Minigame Contract v2 Foundation
- [x]
Merged: PR #66
PlanRef:
- design: docs/design/epic-22.md
- archive: artifacts/archive/epic-22.0/latest
- slice: 22.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 22.1: introduce Minigame Contract v2 and annotate enabled minigames with interaction metadata.

Requirements:
- Extend minigame types to include:
  - interactionType enum:
    - tap-choice, drag-drop, swipe-match, timed-pop, sort-into-bins, memory-flip, trace-numberline, build-sequence
  - requiredInputs (pointer/drag/keyboard fallback expectations)
  - optional timeSensitivity with kid-safe behavior metadata
  - mechanic-unique difficulty knobs
  - layoutClass and optional duplication justification metadata
- Annotate enabled minigames in registry/map with v2 metadata
- Add validation unit tests for required metadata and allowed enum values
- Keep Dutch copy and existing behavior stable
- Add one E2E smoke assertion proving play route remains functional after migration

Acceptance:
- Enabled minigames compile with Contract v2 metadata
- Validation tests fail on missing/invalid interaction metadata
- At least one E2E smoke path passes in container
- Typecheck clean, Gate D unchanged, build/perf gate passes

---

## Epic 22.2 — Drag/Drop + Timed-Kind Mechanic Upgrades
- [x]
Merged: PR #67
PlanRef:
- design: docs/design/epic-22.md
- archive: artifacts/archive/epic-22.0/latest
- slice: 22.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 22.2: upgrade two minigames to genuinely distinct drag/drop and timed-kind interactions.

Requirements:
- Upgrade at least one minigame to drag/drop-first interaction with explicit keyboard fallback
- Upgrade at least one minigame to timed-but-kind behavior:
  - timer is gentle
  - timeout shows hint and continues
  - no fail-state/punishment
- Ensure both minigames have distinct layoutClass values and non-shared unique knobs
- Keep reduced-motion behavior and Dutch UI copy
- Add E2E:
  - drag/drop completes one round
  - timed game timeout continues gracefully

Acceptance:
- Drag/drop and timed-kind interactions are visibly and mechanically distinct
- Timeout path shows hint + continue without reset punishment
- Keyboard fallback exists for drag/drop flow
- Required E2E scenarios pass via docker compose e2e service

---

## Epic 22.3 — Sorting + Sequence/Spatial Mechanic Upgrades
- [x]
Merged: PR #68
PlanRef:
- design: docs/design/epic-22.md
- archive: artifacts/archive/epic-22.0/latest
- slice: 22.3
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 22.3: upgrade two additional minigames for sorting/categorization and sequence/spatial gameplay.

Requirements:
- Add/upgrade one sorting minigame (`sort-into-bins`) with keyboard-first fallback path
- Add/upgrade one sequence/spatial minigame (`build-sequence` or `trace-numberline`) with distinct UI composition
- Ensure both declare unique layoutClass metadata
- Keep Dutch copy and a11y constraints
- Add E2E:
  - sorting round completed with keyboard fallback
  - sequence/spatial round completed

Acceptance:
- Sorting and sequence/spatial minigames are not reskins of tap-choice
- Keyboard sorting flow works end-to-end
- Both minigames pass reduced-motion checks
- E2E scenarios pass in container-only Playwright

---

## Epic 22.4 — Diversity Gate Rubric + CI Enforcement
- [x]
Merged: PR #69
PlanRef:
- design: docs/design/epic-22.md
- archive: artifacts/archive/epic-22.0/latest
- slice: 22.4
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 22.4: implement the hard Diversity Gate and wire it into CI.

Requirements:
- Add rubric + automated check requiring each minigame metadata includes interactionType
- CI fails if `>= 60%` of enabled minigames share the same interactionType
- CI fails if minigame marked `new` duplicates `interactionType + layoutClass` without justification
- Expose clear machine- and human-readable failure diagnostics
- Add unit tests for threshold boundary and duplicate-rule behavior
- Add one integration/E2E assertion that gate script runs in CI pipeline path

Acceptance:
- Diversity Gate executes in CI and fails invalid metadata distributions
- Threshold and duplication rules are test-covered
- CI output pinpoints offending minigames
- Gate C/D/F remain green on valid config

---

## Epic 22.5 — Kid-safe Timer Policy + Settings Integration
- [x]
Merged: PR #70
PlanRef:
- design: docs/design/epic-22.md
- archive: artifacts/archive/epic-22.0/latest
- slice: 22.5
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 22.5: unify timer safety rules and expose global timer-disable behavior in settings.

Requirements:
- Implement optional timer policy in minigame runtime:
  - timeout always hint + continue
  - no punitive timeout state
- Add settings control to disable timers globally
- Ensure reduced-motion path degrades timer visuals and motion-heavy cues
- Keep Dutch copy for new settings/help text
- Add E2E:
  - enable timer disable -> timed minigame runs without countdown pressure
  - reduced-motion run behaves correctly

Acceptance:
- Timer toggle works across timed minigames
- Timeout remains non-punitive in all timed paths
- Reduced-motion behavior verified
- E2E and typecheck/build gates pass

---

## Epic 22.6 — Container-only E2E Proof + Final Hardening
- [x]
Merged: PR #71
PlanRef:
- design: docs/design/epic-22.md
- archive: artifacts/archive/epic-22.0/latest
- slice: 22.6
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 22.6: finalize Epic 22 with deterministic interaction-diversity E2E coverage and hardening checks.

Requirements:
- Consolidate/extend Playwright suite to prove interaction diversity requirements:
  - drag/drop complete round
  - timed timeout continues gracefully
  - sorting keyboard fallback
- Ensure all Playwright invocations use docker compose e2e service only
- Add Dutch copy assertions for new hint/timer/settings strings
- Run final a11y and reduced-motion smoke checks
- Verify CI gates and archive evidence in artifacts

Acceptance:
- Required interaction-diversity E2E scenarios are green in container
- No host-side Playwright usage in scripts/docs/workflows
- Dutch copy and accessibility checks pass
- CI stays green with Gate C/D/F + Diversity Gate

---

## Epic 23.1 — Benchmark & Baseline
- [x]
PlanRef:
- design: docs/design/epic-23.md
- archive: artifacts/archive/epic-23.0/latest
- slice: 23.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 23.1: Add Playwright CI benchmark and document baseline.

Requirements:
- Add benchmark script or CI step that records e2e-container job duration
- Document current baseline (Playwright run time) in docs/runbooks or scripts/ci
- CI job outputs duration (e.g. via job summary or artifact)
- All existing Playwright tests must remain green
- Playwright runs container-only via docker compose e2e

Acceptance:
- Benchmark script or step exists and runs in CI
- Baseline documented (current ~2+ min)
- e2e-container job reports duration
- All tests pass

---

## Epic 23.2 — Workers & Project Consolidation
- [x]
PlanRef:
- design: docs/design/epic-23.md
- archive: artifacts/archive/epic-23.0/latest
- slice: 23.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 23.2: Increase Playwright workers and restrict visual project to visual specs only.

Requirements:
- In playwright.config.ts: increase workers from 1 to 2 or 4 when CI=true
- Restrict visual project to run only e2e/visual/*.spec.ts (not all specs)
- Ensure chromium project runs all functional specs
- Verify no shared state between tests (localStorage, session) if workers > 1
- All Playwright tests must pass
- Playwright runs container-only via docker compose e2e

Acceptance:
- workers: 2 or 4 in CI
- visual project runs only visual specs
- Duration reduced by ~40–50%
- All tests green

---

## Epic 23.3 — pnpm Cache & Slow Test Optimization
- [x]
PlanRef:
- design: docs/design/epic-23.md
- archive: artifacts/archive/epic-23.0/latest
- slice: 23.3
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 23.3: Cache pnpm in e2e path and optimize slow tests (e.g. mistakes-review.spec.ts).

Requirements:
- Improve pnpm install caching in e2e container (e.g. mount/store from job cache, or bake deps into e2e image)
- Optimize mistakes-review.spec.ts: reduce timeouts, faster assertions, or split if needed
- All Playwright tests must pass
- Playwright runs container-only via docker compose e2e

Acceptance:
- pnpm install time reduced in e2e run
- mistakes-review.spec.ts no longer slowest file
- Additional 15–25s saved vs 23.2
- All tests green

---

## Epic 23.4 — Fine-Tune to <60s
- [x]
PlanRef:
- design: docs/design/epic-23.md
- archive: artifacts/archive/epic-23.0/latest
- slice: 23.4
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 23.4: Final fine-tuning to achieve Playwright CI job < 60 seconds.

Requirements:
- If still >60s: deduplicate overlapping tests (interaction-diversity, mechanic-upgrades, sorting-sequence, minigame)
- Apply any remaining optimizations (sharding, timeout tweaks, etc.)
- Document final config in docs/runbooks
- e2e-container job duration < 60 seconds
- All Playwright tests must pass
- Playwright runs container-only via docker compose e2e

Acceptance:
- e2e-container job completes in < 60 seconds
- All tests green
- Final config documented

---

## Epic 24.1 — Benchmark & Stap-timing
- [x]
Merged: PR #84
PlanRef:
- design: docs/design/epic-24.md
- archive: artifacts/archive/epic-24.0/latest
- slice: 24.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 24.1: Meet duur per CI-stap (Build images, Start stack, Run Playwright) en documenteer baseline.

Requirements:
- Voeg stap-timing toe aan e2e-container job: output duur per stap (build, start, e2e)
- Documenteer huidige baseline in docs/runbooks/e2e-benchmark.md (incl. spinup vs test-runtime)
- CI job summary toont duur per stap
- Alle Playwright tests blijven groen
- Playwright runs container-only via docker compose e2e

Acceptance:
- Baseline per stap gedocumenteerd
- CI output toont duur per stap
- Runbook bijgewerkt
- Alle tests green

---

## Epic 24.2 — MySQL Image Cache
- [x]
Merged: PR #85
PlanRef:
- design: docs/design/epic-24.md
- archive: artifacts/archive/epic-24.0/latest
- slice: 24.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 24.2: Voeg MySQL image cache toe aan e2e-container job (zoals zap-baseline).

Requirements:
- Voeg MySQL image cache toe aan e2e-container job in .github/workflows/gates.yml
- Gebruikzelfde patroon als zap-baseline: cache path, pull-if-miss, load-if-hit
- Plaats cache-stappen vóór "Build images (cached)"
- Bij cache hit: geen mysql pull bij "Start stack (no rebuild)"
- Alle Playwright tests blijven groen
- Playwright runs container-only via docker compose e2e

Acceptance:
- MySQL cache toegevoegd aan e2e-container
- Start stack stap geen mysql pull bij cache hit
- Alle tests green

---

## Epic 24.3 — Build Cache Fix
- [x]
Merged: PR #86
PlanRef:
- design: docs/design/epic-24.md
- archive: artifacts/archive/epic-24.0/latest
- slice: 24.3
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 24.3: Onderzoek en fix docker/bake cache zodat Build images (cached) effectief cache hit gebruikt.

Requirements:
- Analyseer waarom docker/bake-action cache miss geeft (indien van toepassing)
- Pas cache-from/cache-to of bake config aan voor betere cache hits
- Documenteer wijzigingen in docs/runbooks
- Bij cache hit: geen volledige rebuild van web/api images
- Alle Playwright tests blijven groen
- Playwright runs container-only via docker compose e2e

Acceptance:
- Bake cache hit effectief (geen rebuild bij hit)
- Config gedocumenteerd
- Alle tests green

---

## Epic 24.4 — Fine-tune Spinup
- [x]
PlanRef:
- design: docs/design/epic-24.md
- archive: artifacts/archive/epic-24.0/latest
- slice: 24.4
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 24.4: Fine-tune tot spinup (Build + Start) nagenoeg instantaan.

Requirements:
- Pas eventuele extra optimalisaties toe (volgorde, parallelisatie, etc.)
- Doel: spinup Build + Start significant korter dan ~1m30s
- Documenteer finale config in docs/runbooks/e2e-benchmark.md
- Alle Playwright tests blijven groen
- Playwright runs container-only via docker compose e2e

Acceptance:
- Spinup nagenoeg instantaan (target bereikt)
- Finale config gedocumenteerd
- Alle tests green

---

## Epic 25.1 — Benchmark e2e Install Timing
- [x]
PlanRef:
- design: docs/design/epic-25.md
- archive: artifacts/archive/epic-25.0/latest
- slice: 25.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 25.1: Meet en documenteer baseline voor e2e install-stap.

Requirements:
- Voeg stap-timing toe aan e2e-benchmark.sh of gates.yml voor install-stap
- Documenteer baseline in docs/runbooks/e2e-benchmark.md
- Alle Playwright tests blijven groen
- Playwright runs container-only via docker compose e2e

Acceptance:
- CI output toont duur per substap (install vs test)
- Baseline gedocumenteerd
- Alle tests green

---

## Epic 25.2 — Custom e2e Image met pnpm
- [x]
PlanRef:
- design: docs/design/epic-25.md
- archive: artifacts/archive/epic-25.0/latest
- slice: 25.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 25.2: Custom e2e image met pnpm pre-installed en GHA cache.

Requirements:
- Dockerfile voor e2e (FROM playwright + RUN pnpm install -g pnpm@9)
- Bake target e2e in docker-bake.hcl
- GHA cache voor e2e image (key op lockfile hash)
- Alle Playwright tests blijven groen
- Playwright runs container-only via docker compose e2e

Acceptance:
- e2e image gebouwd en gecached
- Cache hit bij lockfile ongewijzigd
- Alle tests green

---

## Epic 25.3 — Elimineer Runtime Installs
- [x]
PlanRef:
- design: docs/design/epic-25.md
- archive: artifacts/archive/epic-25.0/latest
- slice: 25.3
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 25.3: Verwijder npm install -g pnpm uit e2e run; gebruik custom image.

Requirements:
- e2e service gebruikt custom image (build) in plaats van upstream playwright image
- e2e-benchmark.sh: geen npm install -g pnpm@9 meer; direct pnpm
- pnpm install alleen bij node_modules cache miss (of pre-baked in image)
- Alle Playwright tests blijven groen
- Playwright runs container-only via docker compose e2e

Acceptance:
- Geen pnpm install in container bij cache hit
- Install-stap significant korter
- Alle tests green

---

## Epic 25.4 — Fine-tune & Documenteer
- [x]
PlanRef:
- design: docs/design/epic-25.md
- archive: artifacts/archive/epic-25.0/latest
- slice: 25.4
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 25.4: Fine-tune e2e install optimalisatie en documenteer finale config.

Requirements:
- Pas eventuele extra optimalisaties toe (node_modules pre-bake, cache keys, etc.)
- Doel: install-stap nagenoeg geëlimineerd
- Documenteer finale config in docs/runbooks/e2e-benchmark.md
- Alle Playwright tests blijven groen
- Playwright runs container-only via docker compose e2e

Acceptance:
- Target bereikt (install nagenoeg instant)
- Finale config gedocumenteerd
- Alle tests green

---

## Epic 26.1 — Map Scroll-to-Current + Full-Width Dense Decoration
- [x]
PlanRef:
- design: docs/design/epic-26.md
- archive: artifacts/archive/epic-26.0/latest
- slice: 26.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 26.1: Map scroll-to-current on load + full-width dense background decoration.

Requirements:
- On map load: scroll so current level node is centered (or near-center) in viewport.
  - Use scrollIntoView({ block: 'center' }) or scrollTop calculation.
  - Respect prefers-reduced-motion: instant scroll when preferred.
- Background decoration: expand from path-width band to full page width.
  - MapDecor: distribute items across 0–100% horizontal space (remove path-based bands).
  - Restructure if needed: full-width decoration layer inside map-scroll.
- Decoration density: increase to ~2–3× current (e.g. h/25 vs h/55).
- E2E: assert current node in view after map load; decoration visible.
- Tests: typecheck, build, smoke green.

Acceptance:
- Current level centered on map load
- Decoration spans full width
- Decoration noticeably denser
- Reduced motion respected
- E2E passes

---

## Epic 27.1 — Coral Minigame: Core Mechanic + Assets
- [x]
PlanRef:
- design: docs/design/epic-27.md
- archive: artifacts/archive/epic-27.0/latest
- slice: 27.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 27.1: Replace Coral Builder minigame with drag-to-place mechanic and reef scene.

Requirements:
- Replace MinigameCoralBuilder.vue with new implementation: drag coral piece from source zone to reef target slot
- Create reef-base.svg and coral-piece SVGs in assets/graphics/minigames/coral-builder/
- Source zone: coral pieces (choices) as draggable items; reef zone: reef base with drop target
- Keyboard fallback: Tab through pieces → select; Tab to slot → Enter to place
- Same props (question, difficultyParams) and emit (answer) contract
- Tests: unit test for render + answer emit; E2E smoke for coral round

Acceptance:
- Drag correct piece to reef → answer submitted
- Keyboard flow works (select piece + slot, Enter)
- Reef + coral pieces visible as game objects
- SVG assets < 15 KB total
- Typecheck, build, smoke green

---

## Epic 27.2 — Coral Minigame: Polish + Feedback
- [x]
PlanRef:
- design: docs/design/epic-27.md
- archive: artifacts/archive/epic-27.0/latest
- slice: 27.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 27.2: Add animations, wrong-answer feedback, and hint after 2 wrong.

Requirements:
- Correct drop: snap-in animation, reef glow (300ms)
- Wrong drop: wobble, return to tray (400ms)
- After 2 wrong: reveal hint (target highlight)
- Reduced motion: instant state changes, no wobble/bounce
- Accessibility: focus states, contrast check
- Optional: playCelebrate on correct, gentle wrong SFX

Acceptance:
- Animations feel satisfying
- Wrong answer returns piece gently
- Hint appears after 2 wrong
- Reduced motion respected
- WCAG AA contrast
- Typecheck, build, smoke green

---

## Epic 27.3 — Coral Minigame: Integration + E2E
- [x]
PlanRef:
- design: docs/design/epic-27.md
- archive: artifacts/archive/epic-27.0/latest
- slice: 27.3
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 27.3: Update registry, Dutch copy, and E2E coverage.

Requirements:
- useMinigame.ts: coral-builder contractV2 — interactionType: drag-drop, layoutClass: layout-drag-reef
- nl.json: update minigameCoralBuilder strings (e.g. "Sleep het juiste koraal naar het rif!")
- E2E: update minigame.spec.ts, interaction-diversity.spec.ts if needed for coral-builder
- Visual regression: screenshot baseline for coral minigame
- Bundle budget must pass

Acceptance:
- contractV2 reflects drag-drop mechanic
- Dutch copy correct
- E2E passes (coral round via drag or keyboard)
- Visual baseline committed
- Bundle budget passes
- CI green

---

## Epic 29.1 — Star Scoring Logic + Session Stats
- [x]
PlanRef:
- design: docs/design/epic-29.md
- archive: artifacts/archive/epic-29.0/latest
- slice: 29.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 29.1: Star scoring based on correct answers with configurable thresholds.

Requirements:
- Track correctCount per session (ref incremented on advanceRound('correct'))
- Create computeStars(correctCount, totalRounds, thresholds?) → 0–3; default thresholds [3, 6, 9] for 10 rounds
- Replace mistake-based star logic in play.vue with computeStars(correctCount, roundsPerLevel)
- useLevelProgress.completeLevel: accept stars 0–3; keep best = max(prev, stars)
- Unit tests: computeStars boundary cases; useLevelProgress (0 stars, best-only on replay)
- Typecheck, build green

Acceptance:
- Stars computed from correct answers, not mistakes
- Threshold: <3 correct = 0 stars; 3–5 = 1; 6–8 = 2; 9–10 = 3 (configurable)
- Replay keeps best score (never decreases)
- Unit tests pass

---

## Epic 29.2 — Schema + Persistence + UI Polish
- [x]
PlanRef:
- design: docs/design/epic-29.md
- archive: artifacts/archive/epic-29.0/latest
- slice: 29.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 29.2: Schema update for 0 stars, LevelCompleteModal 0-star message, E2E.

Requirements:
- profileSchema: allow stars 0–3 in levelProgress validation (currently 1–3)
- useLevelProgress: remove min-1 clamp when accepting stars
- LevelCompleteModal: show "Probeer opnieuw" (or similar) for 0 stars; add nl.json key
- MapNode: verify 0 stars display correctly
- E2E: level complete with mixed correct/wrong → correct star count; replay improves; replay does not decrease
- Typecheck, build, smoke green

Acceptance:
- 0 stars displayed when below threshold
- Replay improves score when player does better
- Replay never decreases stored score
- E2E passes

---

## Epic 30.1 — Asset Pipeline + Matrix + MaatjeAvatar
- [x]
PlanRef:
- design: docs/design/epic-30.md
- archive: artifacts/archive/epic-30.0/latest
- slice: 30.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 30.1: Copy maatjes assets, create matrix, types, useMaatje composable, MaatjeAvatar component.

Requirements:
- Copy temp_assets/maatjes to apps/web/assets/graphics/characters/maatjes/ (normaliseer: "een-oog eerlijk" → "een-oog-eerlijk", "slimme rekenaar" → "slimme-rekenaar")
- Create types/maatje.ts: MaatjeId, ExpressionId
- Create maatje-matrix (content/maatje-matrix.ts of composable): character × expression → asset path
- Create useMaatje composable: resolve(character, expression) met fallback
- Create MaatjeAvatar.vue: props character, expression, size?; render img
- Unit tests: useMaatje resolve + fallback; MaatjeAvatar renders
- Typecheck, build green

Acceptance:
- 14 PNG assets in assets/graphics/characters/maatjes/
- Matrix compleet voor wolkje, een-oog-eerlijk, slimme-rekenaar
- MaatjeAvatar rendert correcte afbeelding
- Unit tests pass

---

## Epic 30.2 — Map + Level Complete Integration
- [x]
PlanRef:
- design: docs/design/epic-30.md
- archive: artifacts/archive/epic-30.0/latest
- slice: 30.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 30.2: Integrate MaatjeAvatar in MapAvatar and LevelCompleteModal.

Requirements:
- MapAvatar: replace emoji with MaatjeAvatar (default wolkje, expression Blij); fallback to emoji if asset missing
- LevelCompleteModal: replace MascotIcon with MaatjeAvatar; expression from stars: 0→verdrietig, 1→neutraal, 2→blij, 3→feest
- Fallback chain: requested expression → blij → neutraal → first available
- E2E: map avatar visible; level complete maatje visible with correct expression
- Typecheck, build, smoke green

Acceptance:
- Map toont maatje op huidige node
- Level complete toont maatje met juiste expressie voor 0/1/2/3 sterren
- E2E passes

---

## Epic 30.3 — Mistakes Review + Introductie
- [x]
PlanRef:
- design: docs/design/epic-30.md
- archive: artifacts/archive/epic-30.0/latest
- slice: 30.3
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 30.3: Integrate MaatjeAvatar in MistakesReview and start/index pages.

Requirements:
- MistakesReview: replace MascotIcon with MaatjeAvatar (expression nadenken)
- Start and/or index: add maatje with Neutraal of Blij (introductie)
- nl.json: aria-labels voor maatje waar nodig
- E2E: mistakes review maatje visible; start page maatje visible
- Typecheck, build, smoke green

Acceptance:
- Mistakes review toont maatje (nadenken)
- Start/index toont maatje (neutraal of blij)
- E2E passes

---

## Epic 30.4 — Profile Maatje Selection (Optional)
- [x]
PlanRef:
- design: docs/design/epic-30.md
- archive: artifacts/archive/epic-30.0/latest
- slice: 30.4
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 30.4: Allow profile to select maatje character; show maatje in ProfileSelector and across app.

Requirements:
- ProfileSchema: add maatjeId ('wolkje'|'een-oog-eerlijk'|'slimme-rekenaar') or map avatarId → maatjeId
- ProfileCreate: maatje character choice (3 opties)
- ProfileSelector: show maatje thumbnail instead of emoji when maatje selected
- Migration: existing profiles get default maatje (wolkje)
- MapAvatar, LevelCompleteModal, etc.: use profile.maatjeId
- E2E: create profile with maatje; map/level complete shows chosen maatje
- Typecheck, build, smoke green

Acceptance:
- Profiel kan maatje kiezen
- Gekozen maatje verschijnt op map, level complete, etc.
- E2E passes

---

## Epic 30.5 — Polish + Bundle Budget
- [x]
PlanRef:
- design: docs/design/epic-30.md
- archive: artifacts/archive/epic-30.0/latest
- slice: 30.5
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 30.5: Bundle budget, visual regression, reduced motion, final E2E.

Requirements:
- Bundle budget (Gate F) must pass
- Visual regression baselines: map, level complete, mistakes review
- Reduced motion: map avatar-bounce uit; overige statisch
- Final E2E pass: full flow map → play → complete → review → map
- Typecheck, build, smoke green

Acceptance:
- Bundle budget passes
- Visual baselines committed
- Reduced motion respected
- E2E green

---

## Epic 31.1 — Level Content: 200 Levels
- [x]
PlanRef:
- design: docs/design/epic-31.md
- archive: artifacts/archive/epic-31.0/latest
- slice: 31.1
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 31.1: Expand level content to 200 levels.

Requirements:
- Extend levels.classic.v1.json to 200 entries (merge existing + generated or full regenerate)
- Update generate-levels.mjs (or equivalent) to produce 200 levels with valid schema
- Map and play must use totalLevels = 200; waypoints scale automatically
- levelValidator.test.ts: 200-level pack validates
- Typecheck, build green

Acceptance:
- Map shows 200 level nodes; play supports level 1–200
- levels.classic.v1.json has 200 entries; schema valid
- E2E smoke green

---

## Epic 31.2 — MapNode: Stars Above, Placeholders, Number in Circle
- [x]
PlanRef:
- design: docs/design/epic-31.md
- archive: artifacts/archive/epic-31.0/latest
- slice: 31.2
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 31.2: Move stars above level circle, add empty placeholders, always show level number in circle.

Requirements:
- Stars row above the circle; fixed height; 3 slots
- When stars = 0: render 3 empty star outlines (placeholder) so no layout jump
- Level number always visible inside circle (including completed levels)
- Aria-labels updated for new layout
- Typecheck, build, E2E green

Acceptance:
- Stars above circle; placeholders prevent layout shift when stars appear
- Every node shows level number in circle
- E2E passes

---

## Epic 31.3 — MapAvatar: Much Larger
- [x]
PlanRef:
- design: docs/design/epic-31.md
- archive: artifacts/archive/epic-31.0/latest
- slice: 31.3
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 31.3: Make map avatar much bigger.

Requirements:
- MapAvatar: increase size from 40px to ~96px (or 80–100px)
- MaatjeAvatar: add size="xl" (96px) or use existing lg (80px) for map
- map.vue: adjust avatarStyle top offset for larger avatar
- Typecheck, build, E2E green

Acceptance:
- Avatar on map is clearly larger than level circles
- Avatar correctly positioned above current node
- E2E passes

---

## Epic 31.4 — Polish & E2E
- [x]
PlanRef:
- design: docs/design/epic-31.md
- archive: artifacts/archive/epic-31.0/latest
- slice: 31.4
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

/feature --ci --max-tasks=5
Build Epic 31.4: Polish, E2E updates, bundle budget, reduced motion.

Requirements:
- E2E: map smoke covers 200 levels, scroll-to-current, avatar, node layout
- Bundle budget (Gate F) must pass
- Reduced motion: avatar bounce uit indien preferred
- Final E2E pass: map → play level 1 and level 200 → back to map
- Typecheck, build green

Acceptance:
- Bundle budget passes
- E2E green
