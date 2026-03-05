# UX — Epic 21.6

## Layout

MinigameRenderer integrated **below** ProblemCard in keypad mode.

## Structure

```
[ProblemCard]
[MinigameRenderer]  ← interaction wrapper
```

- ProblemCard: canonical math display
- MinigameRenderer: tap/drag interaction for answer
- Fallback: Keypad if minigame unavailable
