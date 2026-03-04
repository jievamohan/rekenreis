---
id: "0048"
title: "play-integration-packs"
owner: "orchestrator"
status: "done"
scope_in:
  - "play.vue: load level pack by interactionMode (classic/timed-pop/build-bridge)"
  - "usePlayGame: apply pacing to levelPack when source=pack"
  - "Fallback: if no pack for mode, use infinite or generic pack"
scope_out:
  - "E2E tests"
acceptance:
  - "Pack mode uses mode-specific pack when available"
  - "Pacing applied before question generation"
  - "Infinite mode unchanged"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/pages/play.vue"]
  - name: "W2"
    files: ["apps/web/composables/usePlayGame.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 8 Task 4. Wire pack loading and pacing into play flow.
