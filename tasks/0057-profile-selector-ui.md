---
id: "0057"
title: "profile-selector-ui"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create ProfileSelector.vue: list profiles, tap to switch"
  - "Create profile: name input, avatar picker (4 options)"
  - "Large tap targets (min 44px)"
  - "Accessible: keyboard, aria-labels"
scope_out:
  - "Parent gate, settings"
acceptance:
  - "Profile list shows avatar + name"
  - "Tap profile switches; create flow adds new profile"
  - "Avatar picker offers 4 choices"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/components/ProfileSelector.vue", "apps/web/components/ProfileCreate.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 10 Task 3. Profile selector and creation UI.
