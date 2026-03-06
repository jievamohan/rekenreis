# Epic 22 Design Bible - Minigame Mechanics Overhaul

> PlanRef (master): artifacts/archive/epic-22.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Dutch-speaking children (4-7), parents, and educators using shared devices.

**Primary experience goal:** Make minigames feel truly different in interaction and layout while staying friendly, accessible, and non-punitive.

**Non-negotiable outcomes:**

1. Minigame Contract v2 supports multiple interaction models.
2. At least 4 minigames are mechanically distinct (drag/drop, timed-kind, sorting, sequence/spatial).
3. Diversity Gate blocks homogeneous interaction distributions and unjustified duplicates.
4. Timers are optional, kid-safe, reduced-motion compliant, and disable-able in settings.
5. Container-only Playwright proves behavioral differences.

**Success criteria:**

- 100% enabled minigames declare v2 metadata.
- CI fails if `>=60%` enabled games share one `interactionType`.
- Timeout path always resolves as hint + continue (no fail state).
- Dutch copy remains fully enforced.

---

## 2. Visual Direction (Art Director)

**Theme directive:** Keep underwater style but distinguish games via composition and affordances, not skins.

**Layout-led differentiation:**

- Drag/drop: source-to-target dual zone.
- Timed pop: open field with calm timer signal.
- Sorting: bins with clear icon/label categories.
- Sequence/spatial: ordered path/slots with progression markers.

**Token additions (lightweight):**

- `--mg-drag-accent`
- `--mg-pop-accent`
- `--mg-sort-accent`
- `--mg-seq-accent`
- `--mg-focus-ring`

**Do/Don't:**

- Do use icon + text cues.
- Do preserve large tap targets and visible focus.
- Don't ship reskins as "new" mechanics.
- Don't add heavy animation or graphics dependencies.

---

## 3. UX Layout & Components (UX Designer)

**Primary screen impacted:** `/play`

**Shared regions:**

- Top bar: progress + optional timer + settings.
- Mechanic stage: dynamic per interaction type.
- Hint/feedback rail: supportive copy and guidance.
- Action footer: continue/retry/next controls.

**Interaction blueprints (required upgrades):**

1. **Drag/drop mechanic** (`interactionType: drag-drop`, `layoutClass: layout-dnd-dualzone`)
2. **Timed-kind mechanic** (`interactionType: timed-pop`, `layoutClass: layout-pop-field`)
3. **Sorting mechanic** (`interactionType: sort-into-bins`, `layoutClass: layout-sort-bins`)
4. **Sequence/spatial mechanic** (`interactionType: build-sequence` or `trace-numberline`, `layoutClass: layout-sequence-track`/`layout-route-canvas`)

**Keyboard fallback baseline:**

- All interactive targets reachable by `Tab`.
- Actionable states trigger via `Enter`/`Space`.
- Drag-like interactions include keyboard place/confirm flow.

**Dutch tone examples:**

- "Even pauze, je doet het goed."
- "Hier is een hint. Probeer het nog eens."
- "Ga rustig verder."

---

## 4. Motion & Audio Rules (Motion/Audio)

**Motion principles:**

- Timer urgency stays calm and local.
- Timeout uses soft transition into hint + continue.
- No punitive motion (shake/flash/fail splash).

**Reduced motion behavior:**

- Replace non-essential animation with static state cues.
- Keep all core instructions visible without motion.

**Audio rules:**

- Audio remains optional.
- No alarm-like timeout sound.
- Hint/continue cues are gentle and brief.

---

## 5. Accessibility (UX + QA)

**Keyboard model:**

- Full keyboard operability for all upgraded mechanics.
- Sorting fallback must be explicitly E2E tested.

**Focus states:** consistent visible outlines across all controls.

**Reduced motion:** respected in all timed and animated interactions.

**Screen reader expectations:**

- Hint and timeout messages via `aria-live="polite"`.
- Clear labels for bins, targets, and sequence steps.

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Core changes:**

- Extend `apps/web/types/minigame.ts` with Contract v2 metadata.
- Update minigame registry in `apps/web/composables/useMinigame.ts`.
- Update serving logic in `apps/web/composables/useMinigameServing.ts` to incorporate diversity signals.
- Add validation logic and CI checks for Diversity Gate.

**Contract v2 metadata:**

- `interactionType`
- `requiredInputs`
- `timeSensitivity` (optional, kid-safe policy)
- `difficultyKnobs` (mechanic-unique)
- `layoutClass`
- `isNew` and `duplicationJustification` for novelty enforcement

**Performance constraints:**

- No heavy dependencies.
- Build and bundle budget must remain within Gate F baseline.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Unit coverage:**

- Contract v2 metadata validation.
- Diversity Gate threshold and duplicate-justification rules.

**E2E coverage (container-only):**

- Drag/drop completes a round.
- Timed game timeout continues gracefully.
- Sorting completes with keyboard fallback.

**Commands:**

- `docker compose run --rm e2e pnpm exec playwright test`
- `docker compose run --rm e2e pnpm exec playwright test --grep "drag|timeout|keyboard"`

**Regression checks:**

- Reduced motion behavior.
- Timer-disable setting.
- Dutch copy in new timeout/hint flows.

---

## 8. Security/Privacy Notes (Security/Privacy)

**Risk profile:** medium-low (metadata integrity and UX safety, not sensitive data).

**Controls:**

- Validate metadata schema and clamp dangerous ranges.
- Fail closed on invalid contract entries.
- CI Gate D checks remain mandatory (gitleaks, semgrep, audits).

**Sensitive-domain impact:**

- Auth: none
- Crypto: none
- Payments: none

---

## 9. Slice Map (Orchestrator)

### Epic 22.1 - Contract v2 Foundation
- **Visual milestone:** metadata-backed minigame contract wired and validated.
- **Files/modules:** `types/minigame.ts`, `useMinigame.ts`, `minigame-map` metadata, unit tests.
- **Acceptance:** all enabled minigames declare required v2 metadata; typecheck clean; at least one E2E smoke still green.

### Epic 22.2 - Drag + Timed-Kind Upgrades
- **Visual milestone:** one drag/drop and one timed-kind minigame clearly differ in layout and input.
- **Files/modules:** two minigame components + play integration + localized copy.
- **Acceptance:** drag/drop round completes; timed timeout shows hint + continue; keyboard fallback for drag path.

### Epic 22.3 - Sorting + Sequence/Spatial Upgrades
- **Visual milestone:** one sorting and one sequence/spatial minigame with distinct compositions.
- **Files/modules:** two additional minigame components + serving metadata.
- **Acceptance:** sorting keyboard path works; sequence/spatial gameplay validates order/path semantics.

### Epic 22.4 - Diversity Gate Automation
- **Visual milestone:** CI enforces diversity rubric and emits actionable failures.
- **Files/modules:** diversity gate script/tests, workflow integration, metadata checks.
- **Acceptance:** CI fails at `>=60%` single interaction type; fails unjustified `new` duplicates.

### Epic 22.5 - Kid-Safe Timing + Settings
- **Visual milestone:** timer toggle in settings controls all timed mechanics; reduced-motion path polished.
- **Files/modules:** `settings.vue`, timer policy wiring, timeout UX updates, accessibility tests.
- **Acceptance:** timers can be disabled globally; timeout never punishes; reduced motion respected.

### Epic 22.6 - E2E Hardening + Final Polish
- **Visual milestone:** deterministic container-only E2E proof of interaction diversity and safe timing.
- **Files/modules:** `apps/web/e2e/**`, supporting test fixtures/selectors.
- **Acceptance:** all required Epic 22 E2E scenarios pass via Docker e2e service; Gate C/D/F green.

---

*End of Epic 22 Design Bible*
