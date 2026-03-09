---
id: "0151"
title: "epic31-1-level-content-200"
owner: "orchestrator"
status: "pending"
scope_in:
  - "Extend levels.classic.v1.json to 200 entries"
  - "Update generate-levels.mjs to produce 200 levels with valid schema (pacingTag)"
  - "levelValidator.test.ts: assert 200-level pack validates"
  - "Map and play derive totalLevels from length (no code change)"
scope_out:
  - "MapNode layout, MapAvatar size (Epic 31.2, 31.3)"
  - "Polish/E2E (Epic 31.4)"
acceptance:
  - "Map shows 200 level nodes; play supports level 1–200"
  - "levels.classic.v1.json has 200 entries; schema valid"
  - "levelValidator.test.ts passes for 200-level pack"
  - "E2E smoke green"
lanes:
  - name: "W2"
    files: ["apps/web/content/*.json", "apps/web/scripts/*.mjs", "apps/web/test/levelValidator.test.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "200 JSON entries; bundle budget must pass"
---

## Context

Epic 31.1 — Level Content: 200 Levels. PlanRef: docs/design/epic-31.md.
