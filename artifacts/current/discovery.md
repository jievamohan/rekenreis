# Discovery — Epic 21.6

## Full Flow

1. **Map** — User selects level
2. **Play** — Minigame rotation per round (useMinigameServing)
3. **Complete** — Session ends, feedback shown
4. **Map** — Return to level selection

## Key Behaviors

- MinigameRenderer replaces Keypad when minigame loads
- Fallback to Keypad if minigame fails
- All strings in Dutch
- Deterministic minigame sequence via seed
