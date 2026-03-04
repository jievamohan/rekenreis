---
id: "0035"
title: "mode-contract-types"
owner: "orchestrator"
status: "done"
scope_in:
  - "Define InteractionModeId and ModeDefinition in apps/web/types/mode.ts"
  - "Extend PlayFeedback for timeout type in apps/web/composables/usePlayGame"
  - "Export types for use by mode components and useMode"
scope_out:
  - "Mode components, play page wiring, timer logic"
acceptance:
  - "types/mode.ts exists with InteractionModeId = 'classic' | 'timed-pop'"
  - "ModeDefinition has id and component"
  - "PlayFeedback extended: correct/incorrect | { type: 'timeout', correctAnswer }"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/types/**", "apps/web/composables/usePlayGame.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Types only; minimal runtime impact"
---

## Context

Foundation for Epic 6 Game Modes. Contract defines interaction pattern, separate from skin (visual) and difficulty (upTo10/upTo20).
