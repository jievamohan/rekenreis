---
id: "0019"
title: "rewards-unlocks"
owner: "orchestrator"
status: "done"
scope_in:
  - "useRewards composable: unlock skins by score threshold (local-only)"
  - "Minimal UI: show unlocked vs locked skins (lock icon for locked)"
  - "Config: thresholds e.g. 0→classic+monster-feed, 5→skinA, 10→skinB"
scope_out:
  - "API; server persistence"
  - "Complex gamification overlay"
acceptance:
  - "useRewards(score) returns unlocked skin ids"
  - "UI shows skin availability (unlocked/locked)"
  - "Local-only; no network"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/composables/**", "apps/web/utils/**"]
  - name: "W1"
    files: ["apps/web/components/**", "apps/web/pages/**"]
gates: ["C", "D", "F"]
risks:
  - area: "privacy"
    note: "localStorage only; no PII"
---

## Context

Epic 3: Simple rewards/unlocks local-only.
