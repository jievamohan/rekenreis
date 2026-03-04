---
id: "0013"
title: "skin-contract-types"
owner: "orchestrator"
status: "done"
scope_in:
  - "Define SkinRoundProps and SkinDefinition in apps/web/types/skin.ts"
  - "Export types for use by skin components and useSkin"
scope_out:
  - "Skin components, useSkin, play page changes"
acceptance:
  - "types/skin.ts exists with SkinRoundProps (question, feedback, score, streak, onAnswer, onNext)"
  - "SkinDefinition has id and component"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/types/**"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Types only; no runtime impact"
---

## Context

Foundation for Epic 2 skin system. Contract defines what each skin receives.
