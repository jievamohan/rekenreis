---
id: "0103"
title: "epic19-1-graphics"
owner: "orchestrator"
status: "done"
scope_in:
  - "Update graphics.css with underwater-themed graphics tokens"
  - "Align with art-direction: deep water, teal, coral accents"
  - "Update --graphics-sky, --graphics-water, --graphics-accent, etc."
scope_out:
  - "New SVG assets (Epic 19.3)"
  - "Component styling (task 0104)"
acceptance:
  - "graphics.css defines underwater-themed tokens"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/assets/css/graphics.css"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 19.1 Task 2. Underwater-themed graphics tokens.
