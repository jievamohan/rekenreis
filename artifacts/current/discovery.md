# Epic 22: Discovery (Business Analyst)

**Epic:** Minigame Mechanics Overhaul (creative interaction models + diversity gate)  
**Artifact:** `discovery.md`  
**Author:** business-analyst

---

## Objective

Upgrade minigame variety so children encounter genuinely different interaction patterns, while keeping accessibility, Dutch copy, and CI quality gates intact.

## User Outcomes

- Kids experience clear variety (drag, timed-kind, sorting, sequence/spatial) instead of repeated tap-choice patterns.
- Timer pressure remains supportive: timeout gives hint and continues.
- Accessibility options remain first-class: reduced motion and keyboard fallback.
- Parents can disable timed mechanics in settings.

## Constraints

- Contract v2 must include `interactionType`, required inputs, optional time sensitivity with kid-safe policy, and mechanic-specific difficulty knobs.
- Diversity Gate is hard: CI fails when `>= 60%` enabled minigames share one `interactionType`.
- CI also fails when a minigame marked `new` duplicates `interactionType + layoutClass` without justification.
- Playwright must run only via `docker compose run --rm e2e ...`.
- Dutch UI copy must remain enforced.

## Assumptions

- Existing 6-minigame system is the baseline and can be evolved to metadata-driven v2.
- No API/database changes are needed; work remains in `apps/web`.
- Existing settings model can be extended to include timer disable.

## Non-Goals

- No full art overhaul or narrative rewrite.
- No new backend endpoints or schema migrations.
- No host-side Playwright execution.

## Success Metrics

- 100% enabled minigames validate against Contract v2.
- At least 4 upgraded minigames map to distinct interaction models.
- E2E demonstrates drag/drop completion, graceful timeout continuation, and sorting keyboard fallback.
- Diversity Gate fails misconfigured pools deterministically in CI.
# Epic 22 Discovery: Minigame Mechanics Overhaul

## Objective
Deliver Minigame Contract v2 and upgrade gameplay variety so interaction patterns are meaningfully different, kid-safe under time pressure, and enforceable by CI through a measurable diversity gate.

## User Outcomes
- Kids encounter clearly different interaction styles across sessions, reducing repetition fatigue.
- Timed challenges feel supportive, not punitive: timeout gives hint + continue instead of hard fail.
- Players with motion sensitivity or accessibility needs can still complete minigames (reduced motion + keyboard fallback + timers off).
- Rotation feels fresher because selection is constrained by interaction diversity, not only content theme.

## Constraints
- Contract must expose `InteractionType` enum with exactly: `tap-choice`, `drag-drop`, `swipe-match`, `timed-pop`, `sort-into-bins`, `memory-flip`, `trace-numberline`, `build-sequence`.
- At least 4 minigames must be upgraded with truly different interaction models, including:
  - drag/drop
  - timed-but-kind
  - sorting/categorization
  - spatial/sequence
- Diversity Gate rules are mandatory in CI:
  - fail if `>=60%` of enabled minigames share the same `interactionType`
  - fail if a minigame marked `new` duplicates `interactionType + layoutClass` without explicit justification metadata
- Timers are optional and kid-safe:
  - timeout path must show hint + continue
  - must respect reduced-motion preferences
  - must be disable-able in settings
- Playwright coverage must run container-only and include:
  - drag/drop scenario
  - timed timeout graceful continue scenario
  - sorting keyboard fallback scenario
- Keep Dutch copy policy and existing accessibility constraints intact.

## Assumptions
- Six minigames remain the baseline inventory during this epic; upgrades can modify mechanics without requiring full content rewrites.
- Current rotation map can be extended with metadata needed for diversity calculations without breaking existing enable/disable flags.
- “Truly different” is validated by both `interactionType` and `layoutClass`, not copy/theme alone.
- CI has access to minigame registry/config at build/test time for deterministic diversity checks.
- Keyboard fallback requirements apply at least to sortable/categorization flows and any drag-reliant flow where feasible.

## Non-Goals
- No full narrative/content redesign of all minigames beyond mechanics needed for interaction diversity.
- No new backend gameplay service or persistence model unless required for existing contract compatibility.
- No relaxation of accessibility standards to ship interaction novelty faster.
- No host-side Playwright execution; no alternative test path outside container workflow.

## Measurable Success Metrics
- Contract adoption: 100% of enabled minigames compile/validate against Contract v2 (`interactionType` + required metadata present).
- Interaction diversity: CI passes only when no single `interactionType` reaches `60%` or more of enabled set.
- Upgrade depth: minimum 4 upgraded minigames mapped to distinct interaction buckets and distinct gameplay behavior.
- Safety behavior: timed minigames demonstrate timeout -> hint -> continue flow in automated tests.
- Accessibility compliance:
  - reduced-motion mode suppresses timer/motion-heavy effects
  - timer disable setting prevents forced countdown gameplay
  - keyboard fallback for sorting path verified in Playwright
- Regression control: existing Dutch copy and baseline accessibility checks remain passing after migration.
# Discovery — Epic 21.6

## Full Flow

1. **Map** — User selects level
2. **Play** — Minigame rotation per round (useMinigameServing)
3. **Complete** — Session ends, feedback shown
4. **Map** — Return to level selection

## Key Behaviors

- MinigameRenderer replaces Keypad when minigame loads
- Fallback to Keypad if minigame fails
- All strings in Dutch
- Deterministic minigame sequence via seed
