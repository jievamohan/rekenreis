---
id: "0016"
title: "monster-feed-skin"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create SkinMonsterFeed.vue implementing skin contract"
  - "Minimal thematic UI (e.g. monster/emoji, feed correct answer)"
  - "Accessible: ARIA, keyboard, focus"
scope_out:
  - "Additional skins (Epic 3)"
  - "Heavy assets or complex animations"
acceptance:
  - "SkinMonsterFeed.vue implements SkinRoundProps"
  - "Same interaction: choices, feedback, Next"
  - "Thematic twist (monster feed concept)"
  - "a11y preserved"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/components/skins/**"]
  - name: "W2"
    files: ["apps/web/composables/useSkin.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Keep minimal; no heavy deps"
---

## Context

First alternative skin. Depends on 0013, 0014.
