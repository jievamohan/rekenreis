---
id: "0037"
title: "timed-pop-mode"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add recordTimeout() to usePlayGame"
  - "Implement ModeTimedPop.vue: question + choices + configurable timer"
  - "On timeout: friendly feedback, reveal answer, enable Next"
  - "Keyboard playable; timer does not block"
  - "Register timed-pop in useMode"
scope_out:
  - "Multiple timer presets"
  - "Heavy animations"
acceptance:
  - "ModeTimedPop shows question, choices, and countdown timer"
  - "Answer before timeout: normal feedback flow"
  - "Timeout: 'Time's up! The answer was X.' + Next"
  - "recordTimeout does not change score"
  - "Keyboard can select and answer"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/components/modes/**"]
  - name: "W2"
    files: ["apps/web/composables/usePlayGame.ts", "apps/web/composables/useMode.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Timer is setInterval; ensure cleanup on unmount"
deps: ["0035", "0036"]
---

## Context

Implement timed-pop interaction. Core loop unchanged; mode adds timer layer. Timer is generous (e.g. 15s default), configurable.
