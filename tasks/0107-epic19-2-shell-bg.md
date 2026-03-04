---
id: "0107"
title: "epic19-2-shell-bg"
owner: "orchestrator"
status: "done"
scope_in:
  - "AppShell: add underwater background pattern (gradient or subtle bubble)"
  - "Themed top bar (profile pill, Choose game) use tokens"
  - "Profile pill hover: use rgba with new primary"
scope_out:
  - "Full asset pipeline (Epic 19.3)"
acceptance:
  - "Shell has underwater-themed background"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/components/AppShell.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 19.2 Task 2. AppShell underwater background.
