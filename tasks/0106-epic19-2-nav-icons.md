---
id: "0106"
title: "epic19-2-nav-icons"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add assets/graphics/icons/ directory"
  - "Create SVG icons: fish (stickers), chart/bubbles (progress), gear/coral (settings)"
  - "Each SVG < 2KB, simple line/outline style"
scope_out:
  - "Background patterns (Epic 19.3)"
acceptance:
  - "3+ SVG icons in assets/graphics/icons/"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/assets/graphics/icons/*"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 19.2 Task 1. Add underwater-themed nav SVG icons.
