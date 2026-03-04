---
id: "0104"
title: "epic19-1-surfaces"
owner: "orchestrator"
status: "done"
scope_in:
  - "Remove hardcoded #fff, #ffffff from dominant surfaces"
  - "GameStageCard: ensure uses var(--app-surface) (already does; verify themed)"
  - "Replace white in: play.vue, ProfileSelector, ProfileCreate, PlayModeSelector, ParentGate"
  - "Replace white in skin components (SkinClassic, SkinMonsterFeed, SkinPirate, SkinSpace)"
  - "Replace white in ModeTimedPop"
  - "Use var(--app-surface) or themed tokens instead"
scope_out:
  - "Nav/Shell redesign (Epic 19.2)"
  - "New icons (Epic 19.3)"
acceptance:
  - "No white (#fff/#ffffff) as primary surface anywhere"
  - "Stage card has themed (non-white) surface"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/components/**/*.vue", "apps/web/pages/*.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 19.1 Task 3. Remove hardcoded white from dominant surfaces.
