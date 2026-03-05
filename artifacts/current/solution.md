# Solution — Epic 21.4

**Source:** docs/design/epic-21.md

## Implementation Order

1. **FishFeed** — MinigameFishFeed.vue, timer logic, pellet drop, tap handler
2. **CoralBuilder** — MinigameCoralBuilder.vue, piece reveal, tap handler
3. **SVGs** — Placeholder assets in fish-feed/ and coral-builder/
4. **i18n** — Dutch keys in nl.json for both minigames

## Integration

- Register in useMinigame; add to minigame-map.v1.json
- Wire difficulty knobs (timerSeconds, pelletFlowRate, pieceCount, pieceRevealDelay)
