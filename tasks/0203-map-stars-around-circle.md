---
id: "0203"
title: "map-stars-around-circle"
owner: "orchestrator"
status: "pending"
scope_in:
  - "MapNode.vue: sterren groter (18–20px)"
  - "MapNode.vue: sterren in arc rond bovenkant van cirkel"
scope_out:
  - "Locked state, level number, path, scroll"
acceptance:
  - "Sterren zijn groter dan huidige 12px"
  - "Sterren volgen een boog rond de cirkel"
  - "3 sterren correct weergegeven (filled/empty)"
  - "Typecheck en E2E slagen"
lanes:
  - name: "W1"
    files: ["apps/web/components/map/MapNode.vue"]
gates: ["C", "D", "F"]
risks: []
---

Map UX: stars around circle. PlanRef: artifacts/current/solution.md.
