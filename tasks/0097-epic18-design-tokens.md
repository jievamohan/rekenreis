---
id: "0097"
title: "epic18-design-tokens"
owner: "orchestrator"
status: "done"
scope_in:
  - "Define design tokens (CSS variables) in apps/web/assets/css/"
  - "Colors: bg, surface, primary, secondary, correct, wrong, muted"
  - "Typography: font-family, scale (large, rounded, kid-friendly)"
  - "Radii, spacing, shadows"
  - "Button + tile base styles"
  - "Import tokens globally (nuxt.config or app)"
scope_out:
  - "AppShell or layout (task 0098)"
  - "Component migration (task 0099)"
acceptance:
  - "tokens.css (or extended graphics.css) defines all tokens"
  - "Tokens used for at least one existing element as proof"
  - "Typecheck passes, build succeeds"
  - "No plain white as default background token"
lanes:
  - name: "W1"
    files: ["apps/web/assets/css/*.css", "apps/web/nuxt.config.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "CSS only; no bundle impact"
---

## Context

Epic 18 Task 1. Single source of truth for kid-friendly design tokens.
