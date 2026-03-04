# Epic 12 — Rewards Expansion: Architecture

## Profile Progress Extension

```ts
progress: {
  bestScore: number
  dailyGoal?: { date: string; roundsPlayed: number }  // YYYY-MM-DD local
}
```

## Sticker Model

- Stickers map 1:1 to skins (for v1): stickerId = skinId
- Category: "Skins" (single category for now)
- Unlock: same as skin (bestScore >= threshold)
- "New": track lastUnlockedAt or session-based

## useDailyGoal

- `getTodayLocal()`: YYYY-MM-DD via `new Date().toLocaleDateString('en-CA')`
- `roundsPlayed`, `goalRounds` (5)
- `incrementRound()`: when round completes; reset if new day
- `isGoalReached`: roundsPlayed >= goalRounds

## Flow

1. Round completes → useDailyGoal.incrementRound() → persist to profile
2. Sticker book → read unlocked from useRewards; show with categories
3. Daily goal widget → show rounds/goal; celebrate when reached
