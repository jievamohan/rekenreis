---
id: "0038"
title: "mode-timer-tests"
owner: "orchestrator"
status: "done"
scope_in:
  - "Unit tests: modeResolver"
  - "Unit tests: usePlayGame.recordTimeout"
  - "Unit tests: timed-pop timer with vi.useFakeTimers"
  - "Unit tests: useMode returns correct component"
scope_out:
  - "E2E automation"
acceptance:
  - "modeResolver: classic/timed-pop from query; unknown → classic; mode=pack does not map to interaction"
  - "recordTimeout: sets timeout feedback, no score change"
  - "Timer: fake timers, expiry calls recordTimeout"
  - "useMode: classic and timed-pop return valid components"
  - "Tests pass"
lanes:
  - name: "T"
    files: ["apps/web/test/**"]
gates: ["C", "D", "F"]
risks: []
deps: ["0035", "0036", "0037"]
---

## Context

Contract and timer behavior must be deterministic. Use vi.useFakeTimers for timer tests.
