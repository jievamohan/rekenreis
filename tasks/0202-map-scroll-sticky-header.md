---
id: "0202"
title: "map-scroll-sticky-header"
owner: "orchestrator"
status: "pending"
scope_in:
  - "map.vue: scrollIntoView block 'start' — current level bovenaan"
  - "map.vue: header position sticky, top 0"
scope_out:
  - "MapPath, MapNode, MapAvatar, mapWaypoints"
acceptance:
  - "Na load staat current level bovenaan viewport"
  - "Header blijft vast aan bovenkant bij scrollen"
  - "Geen overscroll voorbij punt waar current level top is"
  - "E2E map/play flow slaagt"
lanes:
  - name: "W1"
    files: ["apps/web/pages/map.vue"]
gates: ["C", "D", "F"]
risks: []
---

Map UX: scroll behavior + sticky header. PlanRef: artifacts/current/solution.md.
