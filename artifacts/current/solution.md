# Epic 22: Solution Design

**Artifact:** `solution.md`  
**Author:** solution-designer

---

## Delivery Shape

Epic 22 is sliced into 6 micro-epics (`22.1`..`22.6`), each bounded to <= 5 tasks and at least one E2E acceptance point.

## Slice Outline

1. **22.1 Contract v2 foundation**  
   Types, metadata, validation, migration wiring.
2. **22.2 Drag + timed-kind upgrades**  
   First two mechanically distinct minigames.
3. **22.3 Sorting + sequence upgrades**  
   Second two mechanically distinct minigames.
4. **22.4 Diversity Gate in CI**  
   Rubric, automated checks, failing diagnostics.
5. **22.5 Kid-safe timing and settings**  
   Timeout behavior, reduced motion, timer-disable toggle.
6. **22.6 E2E hardening + polish**  
   Container-only Playwright scenarios and final gate verification.

## Lanes and Globs

- `W1`: `apps/web/components/**`, `apps/web/pages/**`
- `W2`: `apps/web/composables/**`, `apps/web/types/**`, `apps/web/content/**`
- `T`: `apps/web/test/**`, `apps/web/e2e/**`
- `I`: `.github/workflows/**`, `scripts/ci/**` (for diversity gate integration)

## Gate Expectations

- **Gate C:** `docker compose exec web pnpm run typecheck` clean.
- **Gate D:** gitleaks, semgrep, `pnpm audit --prod`, `composer audit` clean or documented.
- **Gate F:** build + perf budget pass.

## Test Execution Policy

- Playwright only via `docker compose run --rm e2e ...`.
- No host Playwright command is allowed.

## Safety/Rollback

- Keep serving logic deterministic and reversible.
- If diversity gate causes regressions, roll back to prior selection rules behind a feature flag.
# Epic 22 Solution Orchestration (Minigame Mechanics Overhaul)

## Scope and execution model

Epic 22 is delivered as a micro-epic in 6 slices, each slice capped at 5 implementation tasks, with wave-ordered integration:

- Wave 0: shared contracts/config
- Wave 1: API support (if required by config serving/validation)
- Wave 2: Web mechanics and serving updates
- Wave 3: Tests + hardening + CI convergence

Lane model follows repository ownership:

- `W1`: web pages/components (UI surface)
- `W2`: web composables/stores/services (logic)
- `A1`: api endpoints/controllers/routes
- `A2`: api domain/services/models
- `T`: tests
- `I`: deps/infra/CI/Docker
- `D`: DB migrations/schema (not planned in this epic)

## Micro-epic plan (6 slices)

### Slice 1 - Contract v2 + registry metadata baseline (Wave 0)

**Goal:** Introduce and enforce Contract v2 metadata (`interactionType`, `layoutClass`, `new/justification`) in shared game definitions.

**Tasks (max 5):**

1. Define/extend minigame contract types for v2 interaction metadata.
2. Update active minigame registry entries to include required v2 metadata.
3. Add schema/runtime guard for malformed or missing metadata.
4. Add fixture data for diversity-gate test scenarios.

**Lane assignments + file globs:**

- `W2`: `apps/web/composables/**/*`, `apps/web/stores/**/*`, `apps/web/services/**/*`
- `A2` (only if API registry validation exists): `apps/api/app/Domain/**/*`, `apps/api/app/Services/**/*`
- `T`: `apps/web/tests/**/*`, `apps/api/tests/**/*`

**Gate expectations (C/D/F):**

- **Gate C:** Typecheck/PHPStan pass with no new baseline violations after contract additions.
- **Gate D:** Dependency/security posture unchanged; semgrep/gitleaks/audit remain clean.
- **Gate F:** Build and baseline bundle checks pass; no meaningful bundle increase from contract metadata.

---

### Slice 2 - Mechanics upgrade set (4 distinct interaction families) (Wave 2)

**Goal:** Upgrade at least 4 minigames to distinct interaction models: drag/drop, timed-kind, sorting, spatial/sequence.

**Tasks (max 5):**

1. Implement drag/drop mechanic variant with keyboard-accessible fallback hooks.
2. Implement timed-but-kind mechanic path (timeout -> hint -> continue).
3. Implement sorting/categorization interaction flow.
4. Implement spatial/sequence interaction flow.
5. Wire all upgraded games to v2 contract metadata.

**Lane assignments + file globs:**

- `W1`: `apps/web/components/minigames/**/*`, `apps/web/pages/**/*`
- `W2`: `apps/web/composables/minigames/**/*`, `apps/web/services/minigames/**/*`
- `T`: `apps/web/tests/minigames/**/*`

**Gate expectations (C/D/F):**

- **Gate C:** Strict typecheck clean for all new mechanics and metadata wiring.
- **Gate D:** No unsafe DOM/event handling patterns; security scan clean.
- **Gate F:** Build success; interaction latency/regression guard remains within accepted budget.

---

### Slice 3 - Serving logic diversity and anti-repeat enforcement (Wave 2)

**Goal:** Ensure serving logic enforces diversity and recency constraints using interaction families/layout classes.

**Tasks (max 5):**

1. Add diversity scoring/selection utility using `interactionType` + recent history window.
2. Enforce hard threshold rule (fail policy when one interaction type dominates configured enabled set).
3. Enforce duplicate-prevention policy for `new` minigames (`interactionType + layoutClass` unless justified).
4. Add deterministic tests for rotation/selection edge cases.

**Lane assignments + file globs:**

- `W2`: `apps/web/composables/**/*`, `apps/web/stores/**/*`, `apps/web/services/**/*`
- `A2` (if server-side serving exists): `apps/api/app/Domain/**/*`, `apps/api/app/Services/**/*`
- `T`: `apps/web/tests/serving/**/*`, `apps/api/tests/Feature/**/*`

**Gate expectations (C/D/F):**

- **Gate C:** Type-safe selection logic and deterministic test fixtures.
- **Gate D:** Validation logic cannot be bypassed by malformed config inputs.
- **Gate F:** Selection algorithm remains O(n) per serve decision and does not regress session startup.

---

### Slice 4 - Kid-safe timer controls + accessibility integration (Wave 2)

**Goal:** Make timed gameplay optional, reduced-motion aware, and always recoverable.

**Tasks (max 5):**

1. Add/extend user setting to disable timed mechanics.
2. Respect reduced-motion preference for countdown/motion-heavy cues.
3. Implement timeout continuation state with contextual hinting.
4. Add keyboard fallback for sorting/drag-dominant interactions.
5. Add Dutch copy updates for hint/continue states.

**Lane assignments + file globs:**

- `W1`: `apps/web/components/**/*`, `apps/web/pages/**/*`
- `W2`: `apps/web/composables/**/*`, `apps/web/stores/**/*`, `apps/web/services/**/*`
- `T`: `apps/web/tests/accessibility/**/*`, `apps/web/tests/minigames/**/*`

**Gate expectations (C/D/F):**

- **Gate C:** Typecheck clean across settings, accessibility hooks, and timer states.
- **Gate D:** No privacy/security impact; ensure no user setting leaks sensitive data.
- **Gate F:** Build and runtime performance stable with accessibility toggles enabled.

---

### Slice 5 - Container-only Playwright + CI diversity gate (Wave 3)

**Goal:** Add deterministic E2E coverage and CI policy enforcement for gameplay diversity and graceful timeout behavior.

**Tasks (max 5):**

1. Add Playwright E2E for drag/drop flow.
2. Add Playwright E2E for timeout -> hint -> continue flow.
3. Add Playwright E2E for sorting keyboard fallback flow.
4. Add CI-executed diversity gate script/check and integrate into pipeline quality gates.
5. Publish failure diagnostics for diversity violations in CI logs.

**Lane assignments + file globs:**

- `T`: `apps/web/tests/e2e/**/*`, `apps/web/tests/playwright/**/*`
- `I`: `.github/workflows/**/*`, `scripts/ci/**/*`, `docker-compose*.yml`
- `W2`: `apps/web/services/**/*` (if check helper lives in web tooling)

**Container-only Playwright command expectations (mandatory):**

- `docker compose run --rm e2e pnpm playwright test`
- `docker compose run --rm e2e pnpm playwright test --grep "drag|timeout|keyboard"`
- Never run Playwright on host; no direct `pnpm playwright ...` outside container.

**Gate expectations (C/D/F):**

- **Gate C:** Test typings and CI scripts validated; no type regressions from test harness changes.
- **Gate D:** gitleaks/semgrep/audit checks still pass in same CI run.
- **Gate F:** Build plus E2E suite complete within CI budget; no flaky threshold breach.

---

### Slice 6 - Release hardening, rollout controls, and rollback rehearsal (Wave 3)

**Goal:** Ship behind feature flags with safe fallback and documented operational rollback path.

**Tasks (max 5):**

1. Add feature flag(s) controlling Contract v2 enforcement and upgraded minigame serving.
2. Implement fallback path to prior serving behavior when flag is off.
3. Document rollback runbook and trigger conditions.
4. Add smoke test matrix for flag ON/OFF and timer ON/OFF combinations.
5. Validate CI green for final PR head SHA and attach evidence in artifacts.

**Lane assignments + file globs:**

- `W2`: `apps/web/composables/**/*`, `apps/web/stores/**/*`, `apps/web/services/**/*`
- `A1/A2` (only if API flag passthrough exists): `apps/api/routes/**/*`, `apps/api/app/**/*`
- `I`: `scripts/ci/**/*`, `.github/workflows/**/*`
- `T`: `apps/web/tests/**/*`, `apps/api/tests/**/*`

**Gate expectations (C/D/F):**

- **Gate C:** Both flag modes compile/typecheck clean.
- **Gate D:** No secrets in flag config; audit/security scans pass post-toggle wiring.
- **Gate F:** Build and quality checks pass in both effective runtime modes.

## CI diversity gate strategy

The diversity gate is a first-class CI quality check, not advisory lint.

**Policy:**

- Fail when `>=60%` of enabled minigames share a single `interactionType`.
- Fail when a `new` minigame duplicates `interactionType + layoutClass` without explicit justification metadata.
- Emit machine-readable diagnostics and human-readable offender list.

**Execution location:**

- Primary: pull request CI workflow (`.github/workflows/*`) before merge readiness.
- Secondary: local preflight via runbook command in containerized web context.

**Suggested run points:**

1. After unit/type gates (fast fail on contract issues first).
2. Before container Playwright (avoid expensive E2E if diversity baseline is already invalid).

## Rollback and feature-flag safety notes

- Ship Contract v2 consumption under explicit feature flag (default OFF until CI green and smoke checks pass).
- Keep legacy serving path reachable while flag is OFF to preserve continuity.
- Rollback trigger conditions:
  - E2E timeout/hint flow regression
  - diversity gate false positives in production-like config
  - accessibility regressions (reduced-motion or keyboard fallback failures)
- Rollback action:
  - Disable Contract v2 serving flag
  - Revert to prior minigame selection path without redeploy of unrelated services when possible
- Data safety:
  - No destructive schema/data changes planned in this epic; lane `D` intentionally unused.
  - If later DB scope is introduced, create `artifacts/current/db-review.md` before execution.

## Dependency/infra/security notes

- No mandatory dependency upgrades assumed for baseline Epic 22 delivery.
- If CI workflow, Docker, or dependency changes are introduced during implementation:
  - produce `artifacts/current/infra-review.md` (for CI/Docker)
  - produce `artifacts/current/dependency-review.md` (for package changes)
  - update `artifacts/current/risk.md` with explicit impact statement
# Solution — Epic 21.6

## Order of Work

1. **play.vue integration** — Wire MinigameRenderer, useMinigameServing
2. **a11y fixes** — WCAG AA, reduced motion, keyboard/focus
3. **Performance check** — Bundle budget, lazy-load verification
