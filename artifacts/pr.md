# Epic 6 — Game Modes Framework + 1 New Mode

Build Game Modes framework so we can have different kinds of games without duplicating core logic. Implement ONE new mode: timed-pop.

**Requirements:**
- GameMode contract (InteractionModeId, ModeDefinition)
- /play?mode=classic (default), /play?mode=timed-pop
- Timed-pop: mild timer, friendly timeout, no fail state
- a11y: keyboard playable, timer does not block
- Tests: mode selection, recordTimeout, timer (fake)
- Smoke extended for mode switch

## Tasks

- [x] 0035-mode-contract-types
- [x] 0036-play-query-mode-routing
- [x] 0037-timed-pop-mode
- [x] 0038-mode-timer-tests
- [x] 0039-smoke-mode-switch

## PR Metadata
- Base: main
- Branch: feat/epic6-game-modes
- PR: #21
- URL: https://github.com/jievamohan/rekenreis/pull/21
