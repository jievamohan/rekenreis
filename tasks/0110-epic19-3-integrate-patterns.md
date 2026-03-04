---
id: "0110"
title: "Integrate patterns into AppShell and SceneLayout"
lane: W1
gates: [C, F]
scope_in:
  - "apps/web/components/AppShell.vue"
  - "apps/web/components/graphics/SceneLayout.vue"
scope_out:
  - "apps/web/pages/**"
  - "apps/web/assets/css/**"
risk_tags: []
depends_on: ["0109"]
---

# Task 0110 — Integrate patterns into AppShell and SceneLayout

## Goal

Integrate at least one background pattern (bubble-pattern or wave-overlay) into AppShell and/or SceneLayout so underwater assets are visible on at least one screen.

## Acceptance Criteria

- [ ] At least one background pattern visible in AppShell or SceneLayout
- [ ] Decorative SVGs use aria-hidden="true" or role="presentation"
- [ ] Reduced motion: patterns are static (no CSS animation on decorative patterns if prefers-reduced-motion)
- [ ] Typecheck passes
- [ ] Build passes
