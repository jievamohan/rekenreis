---
id: "0011"
title: "play-page-mode-switch"
owner: "orchestrator"
status: "done"
scope_in:
  - "Read mode from route.query.mode (infinite | pack); default infinite"
  - "Load levels.v1.json when mode=pack (static import or fetch)"
  - "Pass source and levelPack to usePlayGame"
  - "Invalid mode -> fallback to infinite"
  - "Keep UI minimal; no new skin or major layout changes"
scope_out:
  - "Minigame skins"
  - "Backend persistence"
acceptance:
  - "/play and /play?mode=infinite use infinite generator"
  - "/play?mode=pack loads pack and serves from it"
  - "/play?mode=invalid falls back to infinite"
  - "Gate C, D, F pass; existing tests green"
lanes:
  - name: "W1"
    files: ["apps/web/pages/**"]
  - name: "W2"
    files: ["apps/web/composables/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Wire /play to dual-mode. Depends on 0010.

## Dependencies

- Requires task 0010 (usePlayGame dual-mode) complete.
