---
id: "0201"
title: "map-flowing-path"
owner: "orchestrator"
status: "pending"
scope_in:
  - "mapWaypoints.ts: serpentine waypoints — glooiend pad van links naar rechts en terug"
  - "Geen korte bumps; langere golven"
scope_out:
  - "MapPath, MapNode, scroll, header, avatar"
acceptance:
  - "Pad kronkelt glooiend van linkerkant naar rechterkant en weer terug"
  - "Geen korte zigzag-bumps"
  - "Waypoints blijven binnen viewport margins"
  - "Typecheck en mapWaypoints unit test (indien aanwezig) slagen"
lanes:
  - name: "W2"
    files: ["apps/web/utils/mapWaypoints.ts"]
gates: ["C", "D", "F"]
risks: []
---

Map UX: flowing path. PlanRef: artifacts/current/solution.md.
