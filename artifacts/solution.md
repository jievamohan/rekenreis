# Epic 2: Skin System + 1 Skin — Solution

## Approach

1. **Contract first**: Define `SkinRoundProps` and `SkinDefinition` in types/skin.ts
2. **Refactor classic**: Extract current play UI into SkinClassic.vue; play.vue passes props
3. **Skin resolver**: useSkin(route.query.skin) returns { component, id }; fallback to classic
4. **Monster Feed**: New SkinMonsterFeed.vue implementing same contract; minimal thematic UI
5. **Tests**: useSkin returns correct component; contract callback tests

## Implementation notes

- usePlayGame unchanged; play.vue binds its outputs to skin props
- Skin components use defineProps<SkinRoundProps>(); emit via callbacks
- Monster Feed: simple styling, maybe emoji or minimal SVG; no new deps
- Logging: none required for Epic 2
