# Epic 21.2 — Minigame Types + Serving + Difficulty Foundation

**Branch:** `feat/epic-21.2-minigame-foundation`  
**Source:** docs/design/epic-21.md (Epic 21.2 slice)

## Summary

Foundation layer for the 6 minigames: type system, serving logic, difficulty scaling, and MinigameRenderer. No minigame implementations yet—only the plumbing.

## Scope

- **In:** Types (MinigameId, MinigameDefinition, MinigameMap, DifficultyProgression), composables (useMinigame, useMinigameServing, useDifficultyProgression), MinigameRenderer.vue, minigame-map.v1.json
- **Out:** Actual minigame components (Bubble Pop, etc.), i18n, animations, new assets

## Lanes

- W2: types, composables
- W1: MinigameRenderer component

## Gates

- C: typecheck clean
- D: gitleaks/semgrep clean
- F: bundle budget passes

## Deliverables

1. Types in `apps/web/types/minigame.ts`, `difficulty.ts`
2. Composables in `apps/web/composables/`
3. MinigameRenderer.vue with lazy load + Keypad fallback
4. minigame-map.v1.json mapping table
5. Unit tests for serving determinism, difficulty scaling, mapping validation
