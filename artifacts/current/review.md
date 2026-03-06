# Review — Epic 22.1

## Changes

1. **types/minigame.ts**: Added Contract v2 types (InteractionType, RequiredInput, LayoutClass, TimerPolicy, UniqueDifficultyKnob, MinigameContractV2). Extended MinigameDefinition to include `contractV2` field.

2. **composables/useMinigame.ts**: Annotated all 6 minigames with v2 metadata. Added `getAllDefinitions()` helper.

3. **utils/minigame/validateContractV2.ts**: New validation utility for per-minigame and collection-level contract checks.

4. **components/minigames/MinigameRenderer.vue**: Refactored to use registry (`useMinigame().getDefinition`) instead of duplicated component map.

5. **test/contractV2.test.ts**: 20 unit tests covering validation, registry completeness, and enum correctness.

## Verification

- Typecheck: PASS
- Unit tests: 219/219 PASS
- Build: PASS
