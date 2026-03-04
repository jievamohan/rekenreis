---
id: "0015"
title: "extract-skin-classic"
owner: "orchestrator"
status: "done"
scope_in:
  - "Extract current play.vue UI into SkinClassic.vue"
  - "Component receives SkinRoundProps; no game logic"
  - "Register in skin registry"
scope_out:
  - "Monster Feed skin (0016)"
  - "Play page wiring (0017)"
acceptance:
  - "SkinClassic.vue implements skin contract"
  - "Same UI as current play (prompt, choices, feedback, Next, stats, mode)"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/components/**", "apps/web/pages/**"]
  - name: "W2"
    files: ["apps/web/composables/useSkin.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Default skin as reference implementation. Depends on 0013, 0014.
