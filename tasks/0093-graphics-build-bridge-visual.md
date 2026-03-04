---
id: "0093"
title: "graphics-build-bridge-visual"
owner: "orchestrator"
status: "done"
scope_in:
  - "Refactor ModeBuildBridge to use SceneLayout"
  - "Replace button planks with game objects (SVG/styled planks)"
  - "Bridge gap scene: background + bridge left/gap/right + character slot"
  - "Answer choices as draggable planks (not plain buttons)"
  - "Keyboard: select plank → focus drop zone → place"
scope_out:
  - "Wrong-drop behavior (task 0094)"
  - "Reduced motion (task 0095)"
acceptance:
  - "Screen looks like game scene: background + character/object + bridge"
  - "Planks are game objects (wood-like), not form buttons"
  - "Drag/drop works on desktop and touch"
  - "Keyboard alternative works"
  - "Big tap targets (≥44px)"
  - "Mode selector allows switching to build-bridge"
lanes:
  - name: "W1"
    files: ["apps/web/components/modes/ModeBuildBridge.vue", "apps/web/components/**/SceneLayout.vue"]
gates: ["C", "D", "F"]
risks:
  - area: "a11y"
    note: "Keyboard path must work"
---

## Context

Epic 17 Task 2. Transform build-bridge into graphical mode with scene and game objects.
