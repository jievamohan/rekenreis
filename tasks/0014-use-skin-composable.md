---
id: "0014"
title: "use-skin-composable"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create useSkin(skinId) composable"
  - "Registry: classic, monster-feed mapped to components"
  - "Invalid/unknown id → classic fallback"
scope_out:
  - "Skin components implementation"
  - "Play page wiring"
acceptance:
  - "useSkin returns { component, id } for valid id"
  - "useSkin returns classic for invalid/empty id"
  - "Unit test: valid id → correct component; invalid → classic"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/composables/**", "apps/web/types/**"]
  - name: "T"
    files: ["apps/web/**/__tests__/**"]
gates: ["C", "D", "F"]
risks:
  - area: "security"
    note: "Skin id allowlist prevents injection"
---

## Context

Resolves skin id from query/config to component. Depends on 0013.
