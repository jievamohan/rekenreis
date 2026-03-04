# Epic 6 — Game Modes Framework: Backlog

## Epic Summary

Build Game Modes framework so we can have different kinds of games without duplicating core logic. Implement ONE new mode: timed-pop.

## Scope In

- GameMode (interaction) contract: InteractionModeId, ModeDefinition
- Mode registry + resolution from route.query.mode
- /play?mode=classic (default), /play?mode=timed-pop
- Implement timed-pop: timer, friendly timeout, no fail state
- usePlayGame.recordTimeout() for timeout handling
- Extend PlayFeedback for timeout type
- Query param: source=pack|infinite (with backward compat for mode=pack)
- Tests: mode resolver, recordTimeout, timer logic (fake timers)
- Smoke: extend runbook for mode switch

## Scope Out

- Multiple new modes (Epic 7: build-bridge)
- Backend persistence/auth
- Heavy animation or new deps

## Risks

| Area   | Note                                      |
|--------|-------------------------------------------|
| perf   | Timer is lightweight; no new heavy deps   |
| perf   | Mode components are code-split friendly   |

## NFRs

- a11y: keyboard playable, timer does not block progress
- perf: bundle budget unchanged
- Backward compat: /play?mode=pack still works

## Task List

| #    | Task                      | Lanes | Gates  |
|------|---------------------------|-------|--------|
| 0035 | mode-contract-types       | W2    | C,D,F  |
| 0036 | play-query-mode-routing   | W1,W2 | C,D,F  |
| 0037 | timed-pop-mode            | W1,W2 | C,D,F  |
| 0038 | mode-timer-tests          | T     | C,D,F  |
| 0039 | smoke-mode-switch         | I     | C,D,F  |

## Acceptance Criteria (Epic)

- [ ] GameMode contract exists; mode registry resolves classic/timed-pop
- [ ] /play?mode=classic and /play?mode=timed-pop work
- [ ] Timed-pop: timer, timeout shows friendly feedback, continue without fail
- [ ] Keyboard playable; timer does not block
- [ ] recordTimeout + PlayFeedback timeout type
- [ ] Unit tests: mode selection, recordTimeout, timer (fake)
- [ ] Smoke runbook extended
- [ ] Existing smoke/e2e green
