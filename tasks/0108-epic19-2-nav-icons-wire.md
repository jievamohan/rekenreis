---
id: "0108"
title: "epic19-2-nav-icons-wire"
owner: "orchestrator"
status: "done"
scope_in:
  - "NavTabs: accept icon as path or component"
  - "Replace emoji with SVG icons from assets/graphics/icons/"
  - "Update AppShell navItems to use icon paths"
  - "active state: use var(--app-primary) for consistency"
scope_out:
  - "Typography changes (in scope if minimal)"
acceptance:
  - "Nav shows SVG icons instead of emoji"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/components/NavTabs.vue", "apps/web/components/AppShell.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 19.2 Task 3. Wire NavTabs to SVG icons.
