---
id: "0095"
title: "graphics-reduced-motion"
owner: "orchestrator"
status: "done"
scope_in:
  - "prefers-reduced-motion: reduce disables wobble, celebration bounce"
  - "Apply rules from artifacts/motion-audio.md"
  - "Keep essential transitions (plank return, feedback visibility)"
scope_out:
  - "New animation types"
acceptance:
  - "With prefers-reduced-motion: reduce, wobble and bounce disabled"
  - "Layout and feedback still functional"
  - "CSS media query; no JS required"
lanes:
  - name: "W1"
    files: ["apps/web/components/modes/ModeBuildBridge.vue", "apps/web/assets/css/*.css"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 17 Task 4. Accessibility: respect reduced motion preference.
