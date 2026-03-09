---
id: "0153"
title: "epic31-3-map-avatar-larger"
owner: "orchestrator"
status: "pending"
scope_in:
  - "MapAvatar: increase size from 40px to ~96px"
  - "MaatjeAvatar: add size='xl' (96px)"
  - "map.vue: adjust avatarStyle top offset for larger avatar"
scope_out:
  - "Polish/E2E (31.4)"
acceptance:
  - "Avatar on map is clearly larger than level circles (56px)"
  - "Avatar correctly positioned above current node"
  - "E2E passes"
lanes:
  - name: "W1"
    files: ["apps/web/components/map/MapAvatar.vue", "apps/web/components/characters/MaatjeAvatar.vue", "apps/web/pages/map.vue"]
gates: ["C", "D", "F"]
risks: []
---

Epic 31.3. PlanRef: docs/design/epic-31.md.
