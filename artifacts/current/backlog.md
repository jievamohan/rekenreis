# Backlog — Epic 28.1: Memory-Match Core Mechanic + Assets

## Epic Summary

Replace MinigameCoralBuilder with MinigameMemoryMatch: grid of face-down cards (6–8), flip two to find pair that sums to correctAnswer. Correct pair → emit answer; wrong pair → flip back after delay. Keyboard: Tab + Enter.

## Scope In

- Create MinigameMemoryMatch.vue with flip logic
- Card grid (6–8 cards), face-down; flip two, check sum
- Correct pair → emit answer; wrong → flip back after short delay
- Card back SVG in assets/graphics/minigames/memory-match/
- Keyboard: Tab through cards, Enter to flip
- Add memory-match to MinigameId; remove coral-builder from types and registry
- Delete MinigameCoralBuilder.vue
- Update minigame-map.v1.json: replace coral-builder with memory-match in all rules and default pool
- Same props (question, difficultyParams) and emit (answer) contract
- Unit test for render + flip + answer emit; E2E smoke for memory-match round

## Scope Out

- Polish/animations (Epic 28.2)
- E2E visual regression, Diversity Gate verification (Epic 28.3)
- Dutch copy beyond minimal strings (28.2)

## Risks

- perf: new SVG assets; keep < 10 KB total
- a11y: keyboard flow must work

## NFRs

- Typecheck clean, build passes, smoke green
- SVG assets < 10 KB total
- Gate C/D/F pass

## Task List

| Task | Title | Lanes | Gates | Risk |
|------|-------|-------|-------|------|
| 0134 | Memory-Match types + registry + map | W2 | C,D,F | |
| 0135 | MinigameMemoryMatch.vue: core mechanic + assets | W1 | C,D,F | |
| 0136 | Remove coral-builder + tests | W1,W2,T | C,D,F | |
