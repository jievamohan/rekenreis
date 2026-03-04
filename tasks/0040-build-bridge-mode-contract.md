---
id: "0040"
title: "build-bridge-mode-contract"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add 'build-bridge' to InteractionModeId in apps/web/types/mode.ts"
  - "Extend modeResolver and useMode for build-bridge"
  - "Create placeholder ModeBuildBridge.vue (minimal render) so typecheck passes"
scope_out:
  - "Full build-bridge UI, mode selector, tests"
acceptance:
  - "InteractionModeId = 'classic' | 'timed-pop' | 'build-bridge'"
  - "modeResolver resolves 'build-bridge' correctly"
  - "useMode returns ModeBuildBridge for build-bridge"
  - "ModeBuildBridge.vue exists, renders placeholder, receives SkinRoundProps"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/types/mode.ts", "apps/web/utils/modeResolver.ts", "apps/web/composables/useMode.ts", "apps/web/components/modes/*.vue"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Types and registry only; minimal impact"
---

## Context

Foundation for Epic 7. Extend mode contract to support build-bridge before implementing full UI.
