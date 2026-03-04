---
id: "0005"
title: "play-composable"
owner: "orchestrator"
status: "done"
scope_in:
  - "usePlayGame() composable: current question, score, streak, feedback state"
  - "Actions: selectAnswer, nextQuestion; integrates generateAdditionQuestion"
  - "Unit tests for score/streak logic and state transitions"
scope_out:
  - "Page components or routing"
  - "UI styling beyond minimal structure"
acceptance:
  - "usePlayGame(mode) returns reactive state and actions"
  - "selectAnswer(id) updates score/streak, sets feedback"
  - "nextQuestion() loads new question, clears feedback"
  - "Unit tests cover correct/incorrect flows, streak reset"
  - "Gate C, D, F pass; existing tests green"
lanes:
  - name: "W2"
    files: ["apps/web/composables/**", "apps/web/utils/**"]
  - name: "T"
    files: ["apps/web/test/**", "apps/web/**/__tests__/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Composable owns game state for /play page. Depends on task 0004 (generator).

## Dependencies

- Requires task 0004 (types + generator) complete.
