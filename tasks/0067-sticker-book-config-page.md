---
id: "0067"
title: "sticker-book-config-page"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add sticker config: STICKER_CATEGORIES mapping skins to sticker entries"
  - "Create pages/stickers.vue: sticker book UI with categories, locked/unlocked"
  - "New sticker highlight: track recently unlocked this session"
  - "Link to sticker book from play (e.g. nav or rewards link)"
scope_out:
  - "Daily goal widget"
acceptance:
  - "Sticker book shows all stickers by category"
  - "Locked/unlocked state correct"
  - "New highlight for recently unlocked"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/utils/rewardsConfig.ts"]
  - name: "W1"
    files: ["apps/web/pages/stickers.vue", "apps/web/pages/play.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 12 Task 3. Sticker book config and page.
