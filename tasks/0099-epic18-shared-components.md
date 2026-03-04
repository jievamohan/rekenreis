---
id: "0099"
title: "epic18-shared-components"
owner: "orchestrator"
status: "done"
scope_in:
  - "NavTabs: icon + label, big tap targets (>= 44px)"
  - "PrimaryButton, SecondaryButton: playful, consistent"
  - "StatPill: score/streak/rounds today"
  - "GameStageCard: wraps minigames/content with rounded corners, shadow"
  - "Use design tokens for all components"
scope_out:
  - "Page-specific content (task 0100)"
acceptance:
  - "NavTabs, PrimaryButton, SecondaryButton, StatPill, GameStageCard exist"
  - "Components use tokens; tap targets >= 44px"
  - "GameStageCard integrates with AppShell"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/components/NavTabs.vue", "apps/web/components/PrimaryButton.vue", "apps/web/components/SecondaryButton.vue", "apps/web/components/StatPill.vue", "apps/web/components/GameStageCard.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 18 Task 3. Shared UI components for kid-friendly look.
