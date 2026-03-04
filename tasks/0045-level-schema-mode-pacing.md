---
id: "0045"
title: "level-schema-mode-pacing"
owner: "orchestrator"
status: "done"
scope_in:
  - "Extend Level in apps/web/types/level.ts with modeIds?: InteractionModeId[], pacingTag?: 'easy'|'normal'|'challenge'"
  - "Update levelValidator to validate new optional fields"
  - "Backward compatible: existing levels without these fields remain valid"
scope_out:
  - "Content packs, pacing engine, play integration"
acceptance:
  - "Level type includes optional modeIds and pacingTag"
  - "Validator accepts valid modeIds array and pacingTag"
  - "Validator rejects invalid modeIds or pacingTag"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/types/level.ts", "apps/web/utils/levelValidator.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 8 Task 1. Extend level schema to support mode applicability and pacing before content packs.
