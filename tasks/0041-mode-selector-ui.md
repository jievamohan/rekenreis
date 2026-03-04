---
id: "0041"
title: "mode-selector-ui"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create ModeSelector component (big buttons with icons) for mode + optionally skin"
  - "Integrate selector into play.vue — reachable via 'Choose game' / 'Change mode' button"
  - "Persist last mode/skin to localStorage; read on play load"
  - "Sync route.query with selector selection and stored prefs"
scope_out:
  - "build-bridge component implementation"
  - "E2E tests"
acceptance:
  - "ModeSelector shows Classic, Timed Pop, Build Bridge with large tap targets"
  - "Selecting mode updates route.query.mode and localStorage"
  - "On /play load: if stored pref exists, apply; else default classic"
  - "Selector reachable from play page"
  - "Typecheck and a11y (focus visible) pass"
lanes:
  - name: "W1"
    files: ["apps/web/components/**/*.vue", "apps/web/pages/play.vue"]
  - name: "W2"
    files: ["apps/web/composables/*.ts", "apps/web/utils/*.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "LocalStorage reads are cheap"
---

## Context

Kid-friendly mode selector so users can switch between classic, timed-pop, and build-bridge. Remember last selection locally.
