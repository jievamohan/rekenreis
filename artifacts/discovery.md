# Epic 1: Level Contract + Content Pack — Discovery

## User goal(s) and success metrics

- **Primary**: Make the kids math game data-driven via a level schema (addition only for now).
- **Success metrics**:
  - Game consumes level definitions (operator, operand ranges, choiceCount, hintMode, difficultyTag, masteryRules optional).
  - Starter content pack (~50 levels) available and wired into /play.
  - /play can run in "infinite generator mode" AND "content pack mode".
  - Mode switch via config or query param (minimal UX).
  - Same seed → same output (deterministic generator).
  - Existing smoke/e2e tests remain green.

## Scope_in

- **Level schema**: TypeScript type + JSON schema or runtime validator.
  - Fields: operator (addition only), operand ranges (min/max), choiceCount, hintMode, difficultyTag, masteryRules (optional).
- **Deterministic level generator**: Create starter pack from seed/config.
- **Content storage**: Versioned file at `apps/web/content/levels.v1.json`.
- **/play updates**:
  - Infinite generator mode (current behavior, seeded).
  - Content pack mode (load from levels.v1.json).
  - Switch mode via config or query param (minimal).
- **Unit tests**: Schema validation, generator determinism, ranges, correct answer present, choices unique.
- No backend persistence/auth. No new operators. No minigame skins.
- Smoke/e2e tests must not break; update if needed.

## Scope_out

- New operators (subtraction, etc.).
- Minigame skins.
- Backend storage/auth.
- High scores or progress persistence.

## Functional requirements (bulleted, testable)

1. **Level schema**
   - TypeScript type `Level` with: operator, operandMin, operandMax, choiceCount, hintMode, difficultyTag, masteryRules (optional).
   - Runtime validator (e.g. Zod, valibot) or JSON schema that rejects invalid data.
2. **Deterministic generator**
   - `generateLevelPack(seed, config)` produces identical output for same seed/config.
   - Output conforms to Level schema.
3. **Content pack**
   - File `apps/web/content/levels.v1.json` contains ~50 levels.
   - Levels loadable at runtime.
4. **/play modes**
   - Infinite mode: generate questions on-the-fly using seeded generator.
   - Content pack mode: serve questions from loaded pack in order (or shuffled deterministically).
   - Mode switch: config or query param (e.g. `?mode=pack` vs `?mode=infinite`).
5. **Tests**
   - Schema validation passes for valid levels; rejects invalid.
   - Same seed → same level pack output.
   - Sanity: operand ranges respected, correct answer in choices, choices unique.

## Acceptance criteria templates (Given/When/Then)

- **AC-1**: Given a valid Level object, When validated, Then it passes.
- **AC-2**: Given invalid Level (missing operator, bad ranges), When validated, Then it fails.
- **AC-3**: Given seed X and config C, When generateLevelPack(X, C) runs twice, Then output is identical.
- **AC-4**: Given a generated level, When inspecting operands and choices, Then operands in range, correct answer present, choices unique.
- **AC-5**: Given /play?mode=infinite, When playing, Then questions are generated on-the-fly.
- **AC-6**: Given /play?mode=pack (or default from config), When playing, Then questions come from content pack.
- **AC-7**: Given repo, When running existing smoke/e2e tests, Then all pass.

## Edge cases + failure modes

- Empty content pack: fallback to infinite mode.
- Corrupt JSON: graceful error, fallback or clear message.
- Mode param typo: default to safe mode (infinite).

## Dependencies and constraints

- Extends existing `questionGenerator.ts`, `usePlayGame.ts`, `play.vue`.
- No new heavy deps; prefer lightweight validator (Zod/valibot) if needed.
- Content loaded at build or runtime (static import or fetch).

## Risk tags

- **perf**: Low—content pack is static; bundle impact minimal.
- **deps**: Low—one validator lib if not using native JSON parsing + manual checks.
