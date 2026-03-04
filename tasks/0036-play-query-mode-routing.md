---
id: "0036"
title: "play-query-mode-routing"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add modeResolver: resolve interaction mode from route.query.mode"
  - "Add useMode composable: mode registry, resolve component"
  - "play.vue: resolve source (pack/infinite) and interactionMode from query"
  - "Backward compat: route.query.mode=pack → source=pack"
  - "Wire ModeClassic wrapper (delegates to skin)"
scope_out:
  - "Timed-pop implementation"
  - "Timer logic"
acceptance:
  - "/play?mode=classic renders classic mode"
  - "/play (no mode) defaults to classic"
  - "/play?mode=pack yields source=pack (backward compat)"
  - "useMode('classic') returns ModeClassic"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/pages/play.vue", "apps/web/components/modes/**"]
  - name: "W2"
    files: ["apps/web/utils/modeResolver.ts", "apps/web/composables/useMode.ts"]
gates: ["C", "D", "F"]
risks: []
deps: ["0035"]
---

## Context

Wire play page to read mode from query. Mode is higher-level than skin: play resolves mode first, then passes to mode component which may use skin for visuals.
