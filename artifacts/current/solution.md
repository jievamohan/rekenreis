# Solution Design — Epic 28: New Minigame (Replace Coral)

## Approach

1. **Remove** MinigameCoralBuilder.vue (or rename/repurpose)
2. **Create** MinigameMemoryMatch.vue (or chosen mechanic)
3. **Register** in useMinigame.ts with id `coral-builder` (slot reuse) OR introduce new id and update map
4. **Update** minigame-map.v1.json to use new minigame in same level ranges as coral-builder

## Option A: Slot Reuse (coral-builder → memory-match)

- Keep MinigameId `coral-builder` but swap component to memory-match
- Pros: No map/type changes
- Cons: Id is misleading

## Option B: New Id (memory-match)

- Add `memory-match` to MinigameId union
- Remove `coral-builder` from registry and map
- Update map rules to use memory-match where coral-builder was
- Pros: Clear naming
- Cons: More files to touch (types, map, MINIGAME_IDS)

## Recommendation

**Option B** — introduce `memory-match`, remove `coral-builder`. Cleaner long-term.

## Files to Touch

- `apps/web/types/minigame.ts` — add memory-match, remove coral-builder
- `apps/web/components/minigames/MinigameMemoryMatch.vue` — new
- `apps/web/components/minigames/MinigameCoralBuilder.vue` — delete
- `apps/web/composables/useMinigame.ts` — register memory-match, remove coral-builder
- `apps/web/content/minigame-map.v1.json` — replace coral-builder with memory-match in pool
- `apps/web/content/locales/nl.json` — new strings for memory-match
- E2E specs — update references from coral-builder to memory-match
