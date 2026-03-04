---
id: "0017"
title: "play-skin-wiring-tests"
owner: "orchestrator"
status: "done"
scope_in:
  - "Wire play.vue to use useSkin + dynamic skin component"
  - "Read skin from route.query.skin"
  - "Pass usePlayGame outputs to skin as SkinRoundProps"
  - "Tests: skin selection, contract callbacks"
  - "Smoke/e2e: /play, /play?skin=monster-feed green"
scope_out:
  - "Skin selector UI in play page"
acceptance:
  - "/play renders classic by default"
  - "/play?skin=monster-feed renders Monster Feed"
  - "/play?skin=invalid renders classic (fallback)"
  - "Answer flow works for both skins"
  - "Existing smoke tests pass"
  - "Unit tests for skin wiring"
lanes:
  - name: "W1"
    files: ["apps/web/pages/play.vue"]
  - name: "W2"
    files: ["apps/web/composables/**"]
  - name: "T"
    files: ["apps/web/**/__tests__/**", "apps/web/**/*.test.*"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Integrate skin system into play page. Depends on 0015, 0016.
