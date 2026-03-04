# Epic 1: Level Contract + Content Pack — Architecture

## Module boundaries

- **W2 (logic)**: `apps/web/types/level.ts`, `apps/web/utils/levelGenerator.ts`, `apps/web/utils/levelValidator.ts`, `apps/web/composables/usePlayGame.ts` (extended).
- **W1 (UI)**: `apps/web/pages/play.vue` (minimal: mode from route/config).
- **T**: `apps/web/test/levelValidator.test.ts`, `apps/web/test/levelGenerator.test.ts`, `apps/web/test/usePlayGame.test.ts` (extended).
- **Content**: `apps/web/content/levels.v1.json` (static, versioned).

## Data flow

```
levels.v1.json (static)
        │
        ├─► levelValidator.validate(level) → Level | throw
        │
levelGenerator.generateLevelPack(seed, config) → Level[]
        │
        ▼
usePlayGame(mode, source: 'infinite' | 'pack')
        │
        ├─► infinite: generateAdditionQuestion(mode) [existing]
        └─► pack: levelSource.getNextQuestion() from preloaded pack
        │
        ▼
play.vue (unchanged UI surface, mode from route)
```

## Level schema (ADR-lite)

- **Level**: `operator`, `operandMin`, `operandMax`, `choiceCount`, `hintMode`, `difficultyTag`, `masteryRules?`.
- **Operator**: `"addition"` only (extensible for future).
- **Runtime validation**: Zod or valibot for TypeScript-first validation; no backend dependency.
- **Content versioning**: `levels.v1.json`; future versions as `levels.v2.json` with migration path.

## Testing strategy

- **Unit**: Schema validation, generator determinism, sanity checks (ranges, correct answer, unique choices).
- **Integration**: usePlayGame with pack source returns valid questions.
- **Smoke**: /play loads and plays in both modes; existing e2e unchanged.

## Performance

- Content pack: ~50 levels ≈ small JSON (< 10KB); static import acceptable.
- Bundle: validator + generator minimal; Gate F (size) must pass.

## Security

- No user input into level generation beyond mode param; low risk.
- Content pack is static, not user-uploaded.

## Risks + mitigations

| Risk | Mitigation |
|------|------------|
| Bundle bloat | Use small validator (Zod is ~12KB; valibot smaller); Gate F |
| Regressions | Extend existing tests; smoke verification |
