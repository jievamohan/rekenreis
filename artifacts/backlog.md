# Epic 0: Game Core MVP — Backlog

## Epic summary

Playable `/play` route for a kids math game (age ~6) with addition-only core loop: question generation (up to 10 / up to 20), 3–4 multiple choice answers, immediate feedback, score/streak, next-question progression. Accessible (keyboard, focus), minimal UI, no backend/auth. Production-grade data model for future skins/levels.

## Scope_in

- `/play` route in apps/web (Nuxt 3 + Vue 3 + TS)
- Addition-only, modes: up to 10, up to 20
- 3–4 multiple choice answers, immediate feedback, score/streak
- Keyboard + focus accessibility
- Unit tests: generator correctness, choice uniqueness
- No regression: vertical-slice + smoke pass

## Scope_out

- Other operations (subtraction, etc.)
- Minigame skins, backend persistence, auth
- DB migrations, API changes for game logic

## Risks + mitigations

| Risk | Tag | Mitigation |
|------|-----|------------|
| Regression of /start | perf | No edits to start.vue, api.ts; full test suite |
| Bundle bloat | perf | No new heavy deps; gate F |

## NFRs

- **Perf**: Gate F (build + size) pass
- **Security**: No new surface (gate D)
- **A11y**: Keyboard, focus visible, logical tab order

## Task list

| # | Task | Lanes | Gates | Risk tags |
|---|------|-------|-------|-----------|
| 1 | Types + question generator + unit tests | W2, T | C, D, F | — |
| 2 | usePlayGame composable + unit tests | W2, T | C, D, F | — |
| 3 | /play page: UI, feedback, score, streak | W1 | C, D, F | — |
| 4 | A11y (keyboard, focus) + regression verification | W1, T | C, D, F | — |
