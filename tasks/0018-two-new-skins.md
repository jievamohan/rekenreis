---
id: "0018"
title: "two-new-skins"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create 2 new skin components (e.g. space, pirate) implementing SkinRoundProps"
  - "Register in useSkin, skinResolver, SKIN_IDS"
  - "Each skin: minimal thematic UI, a11y preserved"
scope_out:
  - "Rewards/unlocks (task 0019)"
  - "Heavy assets or complex animations"
acceptance:
  - "2 new skins implement SkinRoundProps"
  - "All skins reachable via ?skin=<id>"
  - "a11y preserved (ARIA, keyboard, focus)"
  - "Typecheck passes; bundle within budget"
lanes:
  - name: "W1"
    files: ["apps/web/components/skins/**"]
  - name: "W2"
    files: ["apps/web/composables/useSkin.ts", "apps/web/utils/skinResolver.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Keep minimal; verify bundle budget"
---

## Context

Epic 3: Add 2 skins reusing existing Skin contract.
