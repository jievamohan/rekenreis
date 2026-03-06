# Epic 22: QA Strategy

**Artifact:** `qa.md`  
**Author:** qa-strategist

---

## Test Pyramid

- Unit tests for Contract v2 metadata validation and Diversity Gate logic.
- Component tests for keyboard fallback and timeout/hint transitions.
- Playwright E2E for interaction differences and kid-safe timing.

## Required E2E Scenarios

1. **Drag/drop round completion**
   - Complete one round using drag/drop interaction.
2. **Timed game graceful timeout**
   - Let timer expire and verify hint + continue (no fail state).
3. **Sorting keyboard fallback**
   - Complete sorting path with keyboard only.

## Additional Checks

- Reduced motion behavior validated for upgraded minigames.
- Timer-disable setting disables countdown pressure.
- Dutch copy checks on timeout/hint/cta flows.

## Anti-Flake Strategy

- Use role-based selectors and stable test IDs.
- Avoid fixed sleeps; rely on deterministic state assertions.
- Seed deterministic data where possible.

## Execution Commands (container-only)

- `docker compose run --rm e2e pnpm exec playwright test`
- `docker compose run --rm e2e pnpm exec playwright test --grep "drag|timeout|keyboard"`
# Epic 22 QA Strategy - Minigame Mechanics Overhaul

## Scope
- Validate interaction model changes for Epic 22 with emphasis on correctness, accessibility, resilience, and locale integrity.
- Cover both deterministic logic (unit tests) and player-observable behavior (Playwright end-to-end).
- Enforce container-only browser test execution.

## Quality Goals
- Contract validation and diversity gate logic are deterministic and exhaustively unit-tested.
- Core interaction paths work across pointer and keyboard input modes.
- Time-based mechanics degrade gracefully without state corruption.
- Accessibility toggles (reduced motion, timer disable) alter behavior as intended.
- Dutch copy remains correct and visible in critical game flows.
- E2E suite is stable and repeatable under CI load.

## Test Layers

### 1) Unit Tests (Logic + Contracts)
Focus: fast feedback and high branch coverage for core game rules.

- **Contract validation tests**
  - Accept valid payloads for each round/task type.
  - Reject invalid/missing fields with explicit error objects.
  - Validate boundary values (empty sets, max item counts, invalid IDs, malformed timers).
  - Assert backward-compatible parsing behavior for known legacy contract variants (if supported).

- **Diversity gate logic tests**
  - Gate passes when category/type diversity threshold is met.
  - Gate fails when repeated patterns exceed allowed limits.
  - Tie/boundary tests at exact threshold values.
  - Determinism tests with seeded/randomized candidate pools.
  - Regression fixtures for previously observed edge combinations.

- **Suggested assertions**
  - Pure function snapshots only for stable, low-noise outputs.
  - Prefer explicit field-level assertions for gate reasons and error codes.
  - Property-style loops over generated inputs for distribution sanity.

### 2) Playwright E2E Scenarios (Behavior Proof)
Run only in Docker e2e container.

#### Scenario A: Drag/drop complete round
- Start a playable round with drag/drop interaction enabled.
- Perform full drag sequence through required targets.
- Submit/complete round and verify:
  - Score/progress updates correctly.
  - Completion state is rendered.
  - Next-step navigation remains available.
- Validate no console errors during interaction.

#### Scenario B: Timed game timeout continues gracefully
- Start a timed round and let countdown expire naturally.
- Verify timeout UI/state appears without crash or stuck overlay.
- Confirm game flow continues gracefully:
  - Shows feedback/result state.
  - Allows continue/retry action.
  - Session progress remains coherent (no negative timer, no duplicate finalization).

#### Scenario C: Sorting keyboard fallback
- Enter sorting mode without pointer drag usage.
- Reorder items via keyboard controls only (focus + key commands).
- Verify visual/focus state updates and final order persistence.
- Complete step and confirm same scoring/outcome semantics as pointer path.

### 3) Settings-Based Behavior Tests

- **Reduced motion**
  - Toggle reduced-motion setting on.
  - Assert motion-heavy transitions are replaced/minimized.
  - Validate interaction remains functional and timing-sensitive assertions do not rely on animation duration.

- **Timer-disable**
  - Toggle timer-disable (or equivalent accessibility/gameplay setting).
  - Start normally timed content and assert:
    - No countdown pressure path is active.
    - Round can still be completed manually.
    - Scoring and progression remain valid.

### 4) Dutch Copy Checks
- Assert Dutch strings for:
  - Round instructions
  - Timeout messaging
  - Completion CTA/buttons
  - Error/validation messages exposed to player
- Use exact-text checks for critical labels and regex guards for minor punctuation/whitespace tolerance.
- Ensure locale switch/load does not flash fallback English text in tested flows.

## Anti-Flake Strategy
- Use deterministic test data seeds for round generation.
- Freeze/mock clock for unit tests and any deterministic timeout checks where feasible.
- Prefer semantic locators (`getByRole`, stable `data-testid`) over brittle CSS chains.
- Avoid fixed sleeps; use explicit waits on state transitions and UI contracts.
- Isolate tests: no shared mutable state across specs; reset storage/session between runs.
- Capture traces/screenshots/videos on failure only; keep artifacts for triage.
- Retry policy:
  - Local: 0-1 retry while authoring.
  - CI: max 2 retries for known transient browser/network instability, with flake tagging.
- Track flaky tests explicitly and require root-cause issue before long-term retry exemptions.

## Execution Commands (Docker-only)
All Playwright commands must run via `docker compose run --rm e2e ...`.

```bash
docker compose run --rm e2e pnpm playwright test
docker compose run --rm e2e pnpm playwright test --project=chromium
docker compose run --rm e2e pnpm playwright test tests/e2e/epic22-dragdrop.spec.ts
docker compose run --rm e2e pnpm playwright test tests/e2e/epic22-timeout.spec.ts
docker compose run --rm e2e pnpm playwright test tests/e2e/epic22-sorting-keyboard.spec.ts
docker compose run --rm e2e pnpm playwright test --grep "reduced motion|timer disable|nl-NL"
```

## Exit Criteria
- Unit tests for contract validation and diversity gate pass in CI.
- All three Epic 22 E2E proof scenarios pass in Docker e2e container.
- Reduced-motion and timer-disable setting tests pass.
- Dutch copy checks pass for critical flows.
- No unresolved P0/P1 defects in Epic 22 interaction paths.
- Any quarantined flaky test has linked issue and mitigation owner.

## Risks and Mitigations
- **Risk:** Time-based tests are non-deterministic under CI load.  
  **Mitigation:** Prefer mocked timers/clock control and state-based waits.
- **Risk:** Drag/drop behavior differs across rendering environments.  
  **Mitigation:** Validate pointer + keyboard path parity and keep stable target hooks.
- **Risk:** Locale regressions from fallback content loading.  
  **Mitigation:** Add explicit Dutch assertions at route entry and post-action states.
