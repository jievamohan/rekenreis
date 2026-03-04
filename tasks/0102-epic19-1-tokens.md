---
id: "0102"
title: "epic19-1-tokens"
owner: "orchestrator"
status: "done"
scope_in:
  - "Update tokens.css with underwater palette"
  - "Deep water gradient bg (#0d47a1 → #006064 → #00838f)"
  - "Replace --app-surface, --app-surface-elevated with glass/teal (#ffffff20 or #b2dfdb)"
  - "Update --app-primary, --app-secondary, --app-correct, --app-wrong for underwater"
  - "Update --app-text, --app-text-muted for contrast on dark"
  - "Keep --app-tap-min, focus states, reduced motion"
scope_out:
  - "graphics.css (task 0103)"
  - "Component hardcoded colors (task 0104)"
acceptance:
  - "tokens.css defines underwater palette; no #ffffff as surface"
  - "App background gradient is deep water"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/assets/css/tokens.css"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 19.1 Task 1. Replace white design tokens with underwater palette.
