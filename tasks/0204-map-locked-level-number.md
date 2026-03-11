---
id: "0204"
title: "map-locked-level-number"
owner: "orchestrator"
status: "pending"
scope_in:
  - "MapNode.vue: level nummer altijd zichtbaar"
  - "MapNode.vue: slot als badge rechtsboven op cirkel"
scope_out:
  - "Stars layout, path, scroll"
acceptance:
  - "Bij locked nodes: level nummer zichtbaar in cirkel"
  - "Slot-icoon als kleine overlay/badge (niet over nummer)"
  - "aria-label correct voor locked state"
  - "E2E slagen"
lanes:
  - name: "W1"
    files: ["apps/web/components/map/MapNode.vue"]
gates: ["C", "D", "F"]
risks: []
---

Map UX: locked level number visible. PlanRef: artifacts/current/solution.md.
