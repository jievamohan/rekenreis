# Epic 22: Architecture

**Artifact:** `architecture.md`  
**Author:** principal-architect

---

## Target Architecture

Introduce `Minigame Contract v2` as typed metadata consumed by runtime selection and CI policy checks.

## Planned Modules

- `apps/web/types/minigame.ts` (extend with v2 fields/enums)
- `apps/web/composables/useMinigame.ts` (registry metadata + validation)
- `apps/web/composables/useMinigameServing.ts` (diversity-aware selection)
- `apps/web/content/minigame-map.v1.json` (or v2 successor metadata source)
- `apps/web/test/*` and CI scripts for diversity gate

## Contract v2 Fields

- `interactionType`: enum (`tap-choice`, `drag-drop`, `swipe-match`, `timed-pop`, `sort-into-bins`, `memory-flip`, `trace-numberline`, `build-sequence`)
- `requiredInputs`: includes pointer/drag/keyboard fallback expectations
- `timeSensitivity`: optional kid-safe timer policy
- `difficultyKnobs`: mechanic-unique parameters
- `layoutClass`: UI composition family for anti-reskin checks
- `isNew` + `duplicationJustification` for new-game novelty rule

## Migration Plan

1. Add type-level contract and validators.
2. Annotate existing minigames with v2 metadata.
3. Upgrade 4 target minigames to distinct interaction/layout classes.
4. Enforce via CI gate before merge readiness.

## Risks and Mitigations

- **Risk:** false-positive gate failures on small pools.  
  **Mitigation:** deterministic checks with explicit diagnostics.
- **Risk:** timer regressions in accessibility paths.  
  **Mitigation:** enforce reduced motion + timer-disable tests.

## Out of Scope

- `apps/api` changes
- DB/schema changes
- auth/crypto/payments work
# Epic 22 Architecture: Minigame Contract v2 (Nuxt 3 Web)

## Scope and Boundary

- **In scope:** Nuxt 3 web app contract/modeling, static metadata validation, CI diversity gate inputs, migration path for minigames.
- **Boundary rule:** This epic stays in `apps/web` only. No API/database/schema work is required for Contract v2.
- **Primary architectural goal:** Move minigame configuration from loosely-typed v1 shape to a strict, statically analyzable v2 contract that drives runtime behavior and CI policy checks.

## Contract v2 Design

Contract v2 extends each minigame definition with required metadata:

- `interactionType`
- `requiredInputs`
- `timerPolicy`
- `uniqueDifficultyKnobs`
- `layoutClass`

### Canonical types/interfaces

Proposed type model (TypeScript):

- `InteractionType`
  - Enum/union: `tap-choice | drag-drop | swipe-match | timed-pop | sort-into-bins | memory-flip | trace-numberline | build-sequence`
- `RequiredInput`
  - Union of capability flags, e.g. `pointer`, `drag`, `keyboard`, `swipe`, `timed-response`
- `TimerPolicy`
  - Shape: `{ enabledByDefault: boolean; allowDisableInSettings: boolean; timeoutBehavior: 'hint-continue'; reducedMotionBehavior: 'degrade-or-disable'; }`
- `UniqueDifficultyKnob`
  - Shape: `{ key: string; min: number; max: number; step?: number; description: string; }`
- `LayoutClass`
  - Enum/union for gameplay layout families (example): `grid`, `lane`, `freeform`, `bins`, `path`, `sequence`
- `MinigameContractV2`
  - Superset of v1 definition plus required v2 metadata fields.

## Proposed Files/Modules to Add or Change

All paths are under `apps/web`.

- `types/minigames/contract-v2.ts` (new)
  - Source of truth for `MinigameContractV2` and related enums/unions.
- `types/minigames/index.ts` (change)
  - Export v1 + v2 types; allow staged migration.
- `config/minigames/registry.v2.ts` (new)
  - Static registry of minigame metadata used by runtime and CI checks.
- `config/minigames/migrations/v1-to-v2.ts` (new)
  - Transitional adapter for minigames not yet fully converted.
- `composables/minigame/useMinigameServing.ts` (change)
  - Consume `interactionType`, `layoutClass`, `timerPolicy` and required input capabilities.
- `composables/minigame/useMinigameSettings.ts` (change)
  - Enforce timer-disable rules and reduced-motion behavior from `timerPolicy`.
- `utils/minigame/diversity-gate.ts` (new)
  - Deterministic policy checks over static registry metadata.
- `scripts/ci/check-minigame-diversity.ts` (new)
  - CI entrypoint that fails on diversity policy violations.
- `tests/unit/minigame/diversity-gate.spec.ts` (new)
  - Unit tests for policy logic (including 60% threshold and duplicate rules).
- `tests/unit/minigame/contract-v2.spec.ts` (new)
  - Contract validation tests for required metadata presence and shape.

## Data Flow (Bullet Diagram)

1. Author defines/updates minigame entry in `config/minigames/registry.v2.ts`.
2. TypeScript enforces `MinigameContractV2` at compile time.
3. Runtime serving (`useMinigameServing`) reads static registry and selects a game with metadata-aware rules.
4. UI/runtime logic applies:
   - `interactionType` to interaction renderer branch,
   - `requiredInputs` to capability/fallback behavior,
   - `timerPolicy` to timeout and settings behavior,
   - `uniqueDifficultyKnobs` to tuning profiles,
   - `layoutClass` to layout component/styling selection.
5. CI script (`check-minigame-diversity.ts`) reads the same static registry.
6. CI applies diversity gate policies:
   - fail if any `interactionType` represents `>=60%` of enabled minigames,
   - fail if a `new` minigame duplicates `interactionType + layoutClass` without explicit justification metadata.
7. Build/test pipeline fails early on contract or diversity violations.

## Migration Strategy: v1 -> v2

### Phase 1: Introduce dual-contract compatibility

- Add `contract-v2.ts` and keep v1 definitions exported.
- Implement `v1-to-v2` adapter with safe defaults only for non-critical fields.
- Mark adapted entries with `migrationSource: 'v1-adapter'` for visibility.

### Phase 2: Upgrade at least 4 minigames (explicit path)

Planned first-wave upgrades:

1. **Drag/Drop game** -> `interactionType: drag-drop`, `layoutClass: bins`
2. **Timed-but-kind game** -> `interactionType: timed-pop` (or `tap-choice` with strict timer policy), `layoutClass: lane`
3. **Sorting/Categorization game** -> `interactionType: sort-into-bins`, `layoutClass: grid|bins`
4. **Spatial/Sequence game** -> `interactionType: build-sequence` (or `trace-numberline`), `layoutClass: path|sequence`

For each of the 4:

- Replace adapter usage with native v2 metadata.
- Define at least 2-3 `uniqueDifficultyKnobs` that are not shared as a copied set.
- Validate keyboard/accessibility requirements through `requiredInputs` and fallback paths.

### Phase 3: Enforce strict v2 and remove adapter dependency

- CI warns on adapter usage first, then escalates to failure once migration target is complete.
- Remove v1-only paths from serving logic after all enabled minigames are v2-compliant.

## CI Diversity Gate from Static Metadata

### Policy inputs

- `enabled` flag
- `isNew` flag
- `interactionType`
- `layoutClass`
- `duplicateJustification` (required when duplicate pair is intentional)

### Deterministic checks

- **Distribution check:** no single `interactionType` may cover `>=60%` of enabled set.
- **Novelty check:** if `isNew === true`, reject duplicate `interactionType + layoutClass` unless `duplicateJustification` is present and non-empty.
- **Contract completeness check:** every enabled entry must include all v2 metadata fields.

### Why static metadata

- Fast CI feedback without runtime simulation.
- Easy review diffs for design decisions.
- Single source of truth reused by runtime and policy checks.

## Risks and Mitigations

- **Risk:** Metadata drift between runtime code paths and CI checker.
  - **Mitigation:** Import shared types and registry reader in both runtime and CI scripts; avoid duplicated parsing logic.
- **Risk:** Overly generic difficulty knobs reduce true minigame diversity.
  - **Mitigation:** Require per-minigame `uniqueDifficultyKnobs` review checklist and enforce minimum knob count in tests.
- **Risk:** Adapter defaults could hide missing v2 intent during migration.
  - **Mitigation:** Emit CI warnings for adapter-derived fields; enforce deadline for adapter removal.
- **Risk:** Diversity gate causes frequent false failures with small minigame pools.
  - **Mitigation:** Keep threshold policy deterministic and document expected minimum pool size; provide actionable CI output.
- **Risk:** Timer behavior regresses accessibility.
  - **Mitigation:** Make `timerPolicy` explicit and test reduced-motion + disable-in-settings paths in unit/e2e coverage.

## Explicit Out of Scope

- Any backend (`apps/api`) endpoint, domain, or persistence change.
- Database migrations or schema modifications.
- New authentication, authorization, payments, or crypto changes.
- Full redesign of all minigame content/art/audio beyond contract-related metadata and mechanics wiring.
- Non-deterministic or ML-based serving logic in this epic.

## Acceptance Signals for Architecture

- All enabled minigames compile against `MinigameContractV2` (native or explicitly adapter-backed during transition).
- CI has a dedicated static diversity check command and fails on policy violations.
- At least 4 minigames are mapped with distinct interaction-model intent and v2 metadata.
- Serving/runtime modules consume v2 metadata without crossing web/api boundaries.
