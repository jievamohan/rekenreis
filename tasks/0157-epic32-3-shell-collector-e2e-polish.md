---
id: "0157"
title: "epic32-3-shell-collector-e2e-polish"
status: "pending"
scope_in:
  - "apps/web/assets/graphics/minigames/"
  - "apps/web/e2e/"
scope_out:
  - "apps/api"
lanes: ["W1", "T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "E2E green"
  - "Bundle budget passes"
  - "No submarine-sort references in e2e or assets"
  - "Reduced motion verified (already in MinigameShellCollector)"
---

# Epic 32.3 — Shell Collector: E2E + Polish

## Goal

Final polish: remove orphan submarine assets, verify E2E and bundle budget.

## Implementation

1. Remove apps/web/assets/graphics/minigames/submarine-sort/ (orphan after 32.2)
2. Verify E2E green (interaction-diversity, sorting-sequence already updated in 32.2)
3. Bundle budget (Gate F) must pass
4. Reduced motion: MinigameShellCollector already has @media (prefers-reduced-motion: reduce)
