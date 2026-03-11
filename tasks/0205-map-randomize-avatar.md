---
id: "0205"
title: "map-randomize-avatar"
owner: "orchestrator"
status: "pending"
scope_in:
  - "MapAvatar.vue of map.vue: random avatar op map"
  - "Kies willekeurig uit VALID_AVATARS bij weergave"
scope_out:
  - "Profiel-avatar wijzigen; alleen map-weergave"
acceptance:
  - "Avatar op map is willekeurig (niet per se profiel-avatar)"
  - "Session-based of per mount: consistent tijdens sessie"
  - "Typecheck en E2E slagen"
lanes:
  - name: "W1"
    files: ["apps/web/components/map/MapAvatar.vue", "apps/web/pages/map.vue"]
gates: ["C", "D", "F"]
risks: []
---

Map UX: randomize avatar. PlanRef: artifacts/current/solution.md.
