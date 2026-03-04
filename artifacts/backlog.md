# Epic 1: Level Contract + Content Pack — Backlog

## Epic summary

Make the kids math game data-driven via a Level schema (addition only). Provide a starter content pack (~50 levels), deterministic level generator, and wire /play to support both "infinite generator mode" and "content pack mode" with minimal mode switch (query param). Unit tests for schema validation, generator determinism, and sanity checks. No backend, no new operators, no skins.

## Scope_in

- Level schema (TypeScript + runtime validator): operator, operand ranges, choiceCount, hintMode, difficultyTag, masteryRules (optional)
- Deterministic level generator from seed/config
- Content pack: apps/web/content/levels.v1.json (~50 levels)
- /play dual-mode: infinite | pack, switch via query param
- Unit tests: schema validation, generator determinism, sanity (ranges, correct answer, unique choices)
- Smoke/e2e: must not break; update if needed

## Scope_out

- New operators
- Minigame skins
- Backend storage/auth

## Risks + mitigations

| Risk | Tag | Mitigation |
|------|-----|------------|
| Bundle bloat | perf | Lightweight validator; Gate F |
| Regression | perf | Full test suite; smoke verification |

## NFRs

- **Perf**: Gate F (build + size) pass
- **Security**: Gate D (no new surface)
- **A11y**: No change; existing behavior

## Task list

| # | Task | Lanes | Gates | Risk tags |
|---|------|-------|-------|-----------|
| 1 | Level schema + validator + unit tests | W2, T | C, D, F | — |
| 2 | Deterministic level generator + content pack | W2, T | C, D, F | — |
| 3 | usePlayGame dual-mode (infinite | pack) | W2, T | C, D, F | — |
| 4 | play.vue mode switch via query param | W1, W2 | C, D, F | — |
| 5 | Smoke/e2e verification | T | C, D, F | — |
