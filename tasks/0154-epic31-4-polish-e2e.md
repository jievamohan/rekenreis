---
id: "0154"
title: "epic31-4-polish-e2e"
owner: "orchestrator"
status: "pending"
scope_in:
  - "E2E: map smoke covers 200 levels, scroll-to-current, avatar, node layout"
  - "Bundle budget (Gate F) must pass"
  - "Reduced motion: avatar bounce uit indien preferred"
  - "Final E2E pass: map → play level 1 and level 200 → back to map"
scope_out: []
acceptance:
  - "Bundle budget passes"
  - "E2E green"
lanes:
  - name: "W1"
    files: ["apps/web/components/map/MapAvatar.vue"]
  - name: "T"
    files: ["apps/web/e2e/**/*.spec.ts"]
gates: ["C", "D", "F"]
risks: []
---

Epic 31.4. PlanRef: docs/design/epic-31.md.
