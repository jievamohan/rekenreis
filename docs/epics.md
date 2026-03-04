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
- [ ]
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
- [ ]
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
- [ ]
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
- [ ]
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
- [ ]
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