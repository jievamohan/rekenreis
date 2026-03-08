---
id: "0139"
status: "done"
title: "epic28-1-remove-coral-tests"
scope_in:
  - "Delete MinigameCoralBuilder.vue"
  - "Delete assets/graphics/minigames/coral-builder/"
  - "apps/web/e2e/ minigame.spec.ts, interaction-diversity.spec.ts"
  - "Unit tests for MinigameMemoryMatch"
scope_out:
  - "Polish/animations (28.2)"
lanes: ["W1", "T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "MinigameCoralBuilder.vue deleted"
  - "coral-builder assets deleted"
  - "No remaining references to coral-builder"
  - "Unit test: MinigameMemoryMatch render + flip + answer emit"
  - "E2E smoke: memory-match round completes"
  - "Typecheck, build, smoke green"
---

# Epic 28.1 — Remove Coral + Tests

## Goal

Delete coral-builder component and assets; add tests for memory-match.

## Implementation

1. Delete apps/web/components/minigames/MinigameCoralBuilder.vue
2. Delete apps/web/assets/graphics/minigames/coral-builder/ (or contents)
3. Update E2E: minigame.spec.ts, interaction-diversity.spec.ts — replace coral-builder refs with memory-match
4. Unit test: MinigameMemoryMatch render, flip pair, correct match emits answer
5. E2E smoke: complete one memory-match round
