# Epic 5 Discovery

## Summary
Polish: a11y pass for /play, reduce flakiness/improve error states, perf within budget, docs updated.

## Current State
- /play has keyboard/focus on buttons (choices, Next)
- Smoke verification: docker compose, manual steps
- No formal e2e (Playwright); "e2e" = smoke/manual
- docs/runbooks/commands.md exists

## Scope
- **In**: a11y pass (keyboard, focus), error states, perf budget check, docs
- **Out**: Full Playwright suite; major refactors
