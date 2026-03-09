---
id: "0152"
title: "epic31-2-mapnode-stars-above"
owner: "orchestrator"
status: "pending"
scope_in:
  - "Stars row above the circle; fixed height; 3 slots"
  - "When stars=0: render 3 empty star outlines (placeholder) so no layout jump"
  - "Level number always visible inside circle (including completed levels)"
  - "Aria-labels updated for new layout"
scope_out:
  - "MapAvatar size (31.3)"
  - "Polish/E2E (31.4)"
acceptance:
  - "Stars above circle; placeholders prevent layout shift when stars appear"
  - "Every node shows level number in circle"
  - "E2E passes"
lanes:
  - name: "W1"
    files: ["apps/web/components/map/MapNode.vue"]
gates: ["C", "D", "F"]
risks: []
---

Epic 31.2. PlanRef: docs/design/epic-31.md.
