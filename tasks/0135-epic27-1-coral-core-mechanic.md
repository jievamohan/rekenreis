---
id: "0135"
title: "epic27-1-coral-core-mechanic"
status: "pending"
scope_in:
  - "apps/web/components/minigames/MinigameCoralBuilder.vue"
  - "apps/web/assets/graphics/minigames/coral-builder/"
  - "apps/web/test/"
  - "apps/web/e2e/"
scope_out:
  - "apps/api"
  - "useMinigame.ts (Epic 27.3)"
  - "nl.json (Epic 27.3)"
lanes: ["W1", "T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "Drag correct piece to reef → answer submitted"
  - "Keyboard flow works (select piece + slot, Enter)"
  - "Reef + coral pieces visible as game objects"
  - "SVG assets < 15 KB total"
  - "Unit test for render + answer emit"
  - "E2E smoke for coral round"
  - "Typecheck, build, smoke green"
---

# Epic 27.1 — Coral Minigame: Core Mechanic + Assets

## Goal

Replace Coral Builder minigame with drag-to-place mechanic and reef scene.

## Implementation

1. **MinigameCoralBuilder.vue**: Full rewrite
   - Source zone: coral pieces (choices) as draggable items
   - Reef zone: reef base with one drop target
   - Pointer: drag piece to drop zone → emit answer on correct
   - Keyboard: Tab through pieces → select; Tab to slot → Enter to place
   - Same props (question, difficultyParams) and emit (answer) contract

2. **Assets**: Create in assets/graphics/minigames/coral-builder/
   - reef-base.svg: reef structure with clear drop area
   - coral-piece-1.svg, coral-piece-2.svg (or variants)
   - Total < 15 KB

3. **Tests**
   - Unit: render, emit answer on correct drag/keyboard
   - E2E: coral round completes via drag or keyboard
