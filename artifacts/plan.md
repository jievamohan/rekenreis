# Epic 1: Level Contract + Content Pack — Plan

## Feature summary

Make the kids math game data-driven via a Level schema (addition only). Provide starter content pack (~50 levels), deterministic level generator, wire /play for infinite and content pack modes. Mode switch via query param.

## Branch

- **Feature branch**: `feat/epic1-level-contract-content-pack`
- **Base**: `main`

## Task execution order (max 5)

| # | Task ID | Title |
|---|---------|-------|
| 1 | 0008 | level-schema-validator |
| 2 | 0009 | level-generator-content-pack |
| 3 | 0010 | play-game-dual-mode |
| 4 | 0011 | play-page-mode-switch |
| 5 | 0012 | smoke-e2e-verification |

## Wave plan

- **Wave 0**: Level schema + validator (0008)
- **Wave 1**: Generator + content pack (0009)
- **Wave 2**: usePlayGame dual-mode (0010), play.vue mode switch (0011)
- **Wave 3**: Smoke verification (0012)

## Lane ownership

- W2: types/, utils/, composables/
- W1: pages/, components/
- T: test/, docs/runbooks/
