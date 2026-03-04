---
id: "0080"
title: "ux-tap-targets"
owner: "orchestrator"
status: "done"
scope_in:
  - "Audit all interactive elements for 44×44px minimum tap target (WCAG 2.5.5)"
  - "Fix play.vue: skin-btn, choose-game-btn, close-btn, rewards-link, settings-link"
  - "Fix SkinClassic mode radios (Up to 10/20)"
  - "Fix stickers, summary, settings pages: buttons, links"
  - "Verify ModeBuildBridge planks and drop zone"
scope_out:
  - "Full WCAG audit"
  - "Layout redesign"
acceptance:
  - "All buttons, links, and interactive elements meet min 44×44px (or equivalent touch area)"
  - "No regressions on desktop layout"
  - "Gates C, D, F pass"
lanes:
  - name: "W1"
    files: ["apps/web/pages/**", "apps/web/components/**"]
gates: ["C", "D", "F"]
risks:
  - area: "ux"
    note: "Tap target changes may alter layout; test on small viewport"
---

## Context

Epic 15: Release Prep. Kids use touch devices; tap targets must meet WCAG 2.5.5 (44×44px minimum).

## Dependencies

None.
