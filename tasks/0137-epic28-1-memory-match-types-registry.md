---
id: "0137"
status: "done"
title: "epic28-1-memory-match-types-registry"
scope_in:
  - "apps/web/types/minigame.ts"
  - "apps/web/composables/useMinigame.ts"
  - "apps/web/content/minigame-map.v1.json"
scope_out:
  - "MinigameMemoryMatch.vue component"
  - "coral-builder deletion"
lanes: ["W2"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "MinigameId: add memory-match, remove coral-builder"
  - "MINIGAME_IDS updated"
  - "useMinigame: register memory-match, remove coral-builder"
  - "minigame-map.v1.json: replace coral-builder with memory-match in default pool and all rules"
  - "Typecheck clean"
---

# Epic 28.1 — Memory-Match: Types + Registry + Map

## Goal

Add memory-match to types and registry; remove coral-builder. Update minigame map.

## Implementation

1. types/minigame.ts: replace 'coral-builder' with 'memory-match' in MinigameId and MINIGAME_IDS
2. useMinigame.ts: replace coral-builder registration with memory-match (component import will point to MinigameMemoryMatch.vue; create stub if needed for this task or do in next task)
3. minigame-map.v1.json: replace all "coral-builder" with "memory-match"

Note: Task 0138 creates MinigameMemoryMatch.vue. This task may need to register a placeholder that imports the component; if component doesn't exist yet, we can either (a) create minimal stub in 0137, or (b) do types+map in 0137 and registry in 0138. Prefer: do types+map in 0137; registry update in 0138 when component exists.
