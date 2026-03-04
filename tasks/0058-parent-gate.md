---
id: "0058"
title: "parent-gate"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create ParentGate.vue: two options — hold 3s button OR simple arithmetic (e.g. 3+4=?)"
  - "On pass: emit unlock; store in sessionStorage with short TTL (e.g. 5 min)"
  - "Accessible: keyboard for arithmetic; focus management"
scope_out:
  - "Settings page wiring"
acceptance:
  - "Hold 3s unlocks gate"
  - "Correct arithmetic unlocks gate"
  - "SessionStorage prevents re-prompt for 5 min"
  - "Unit tests for gate logic"
lanes:
  - name: "W1"
    files: ["apps/web/components/ParentGate.vue", "apps/web/test/parentGate.test.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 10 Task 4. Parent gate component for settings access.
