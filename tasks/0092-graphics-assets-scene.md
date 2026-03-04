---
id: "0092"
title: "graphics-assets-scene"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create apps/web/assets/graphics/ folder structure (backgrounds/, objects/, characters/)"
  - "Add SVG placeholders: bridge-scene, plank, bridge spans, gap-slot"
  - "Create SceneLayout.vue: background + foreground + character slot + default slot"
  - "Define CSS tokens from artifacts/art-direction.md"
scope_out:
  - "Integration with ModeBuildBridge (next task)"
  - "High-fidelity art"
acceptance:
  - "assets/graphics/ exists with placeholder SVGs"
  - "SceneLayout renders background layer, foreground layer, content slot"
  - "CSS vars for graphics palette available"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/assets/graphics/**", "apps/web/components/**/SceneLayout.vue", "apps/web/assets/css/*.css"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "SVG placeholders < 2KB each"
---

## Context

Epic 17 Task 1. Bootstrap assets pipeline and scene layout for graphical modes.
