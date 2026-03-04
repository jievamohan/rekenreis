---
id: "0098"
title: "epic18-app-shell"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create global layout (layouts/default.vue or AppShell component)"
  - "Playful background (gradient/soft pattern), not plain white"
  - "Centered game stage card with rounded corners and subtle shadow"
  - "Top bar: active profile pill, Choose game button (primary action)"
  - "Nav: big icon-tabs (Sticker book, Progress, Settings)"
  - "Integrate layout into app.vue or Nuxt layout system"
scope_out:
  - "Shared button/tab components (task 0099)"
  - "Page content migration (task 0100)"
acceptance:
  - "All pages use new layout (no plain white document)"
  - "Top bar shows profile pill and Choose game"
  - "Nav tabs visible with icon + label, tap targets >= 44px"
  - "Stage card wraps main content"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/layouts/*.vue", "apps/web/components/AppShell.vue", "apps/web/app.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 18 Task 2. Global app shell with playful background, stage card, top bar, nav.
