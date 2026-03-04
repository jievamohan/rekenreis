# Epics

> Run with: /run-epics
> Each epic uses /feature --ci --max-tasks=5 (default FORCE autopilot).
> Pipeline: plan -> tasks -> execute -> finalize -> wait for manual merge -> next epic.

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