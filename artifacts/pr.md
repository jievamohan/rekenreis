# Epic 1: Level Contract + Content Pack

## Summary

Make the kids math game data-driven via a Level schema (addition only). Provide a starter content pack (~50 levels) and wire /play to support both "infinite generator mode" and "content pack mode" with minimal mode switch (query param).

## Scope

- **Level schema**: TypeScript type + runtime validator (operator, operand ranges, choiceCount, hintMode, difficultyTag, masteryRules optional)
- **Deterministic level generator**: Same seed → same output
- **Content pack**: `apps/web/content/levels.v1.json` (~50 levels)
- **/play dual-mode**: `?mode=infinite` (default) | `?mode=pack`
- **Tests**: Schema validation, generator determinism, sanity checks (ranges, correct answer, unique choices)

## Non-goals

- New operators
- Minigame skins
- Backend storage/auth

## Tasks

- [x] 0008: Level schema + validator
- [x] 0009: Deterministic generator + content pack
- [x] 0010: usePlayGame dual-mode
- [x] 0011: play.vue mode switch
- [x] 0012: Smoke/e2e verification

## Risks

- Low: May add lightweight validator (Zod/valibot); Gate F enforces bundle budget.

## PR Metadata

- Base: main
- Branch: feat/epic1-level-contract-content-pack
- PR: #10
- URL: https://github.com/jievamohan/rekenreis/pull/10
