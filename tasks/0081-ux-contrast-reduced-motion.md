---
id: "0081"
title: "ux-contrast-reduced-motion"
owner: "orchestrator"
status: "done"
scope_in:
  - "Color/contrast audit: verify 4.5:1 (normal text), 3:1 (large text) where applicable"
  - "Fix any contrast failures (adjust colors, not layout)"
  - "Add prefers-reduced-motion for animations in SkinMonsterFeed, SkinSpace, SkinPirate, ModeTimedPop, ModeBuildBridge"
  - "SkinClassic already has reduced-motion; verify coverage"
scope_out:
  - "Full WCAG contrast audit"
  - "New design system"
acceptance:
  - "Text/background contrast meets 4.5:1 (normal) or 3:1 (large)"
  - "All feedback and decorative animations honor prefers-reduced-motion"
  - "Gates C, D, F pass"
lanes:
  - name: "W1"
    files: ["apps/web/pages/**", "apps/web/components/**"]
gates: ["C", "D", "F"]
risks:
  - area: "ux"
    note: "Color changes must preserve readability"
---

## Context

Epic 15: Release Prep. Color/contrast and reduced motion improve accessibility for kids and caregivers.

## Dependencies

None.
