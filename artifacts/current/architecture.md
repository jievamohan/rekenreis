# Architecture — Epic 21.6

## play.vue Integration

- Uses `useMinigameServing` to pick minigame per round
- MinigameRenderer replaces Keypad optionally
- Fallback: Keypad when minigame fails or unavailable

## Data Flow

1. usePlayGame generates question
2. useMinigameServing.pick(levelId, seed) → minigameId
3. MinigameRenderer resolves component via useMinigame
4. Minigame receives question + onAnswer
