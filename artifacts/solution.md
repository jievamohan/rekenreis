# Epic 12 — Rewards Expansion: Solution

## 1. Profile Schema

Extend `ProfileData.progress`:
```ts
progress: {
  bestScore: number
  dailyGoal?: { date: string; roundsPlayed: number }
}
```
Migration: existing profiles get dailyGoal undefined; init on first use.

## 2. useDailyGoal Composable

- `useDailyGoal(profile?)`
- `getTodayLocal()`: `new Date().toLocaleDateString('en-CA', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })` or simpler: `toLocaleDateString('en-CA')` uses local TZ
- `roundsPlayed`, `goalRounds = 5`
- `incrementRound()`: if date changed, reset to 0; else +1; persist
- `isGoalReached`

## 3. Sticker Config

- `STICKER_CATEGORIES`: [{ id: 'skins', label: 'Skins', stickerIds: SKIN_IDS }]
- Stickers = skins for v1; reuse UNLOCK_THRESHOLDS

## 4. Sticker Book Page

- Route: /stickers
- List stickers by category; show locked/unlocked; "new" if unlocked this session (track in ref)

## 5. Daily Goal Widget

- On play.vue: small "3/5 rounds today" when daily goal enabled
- Call incrementRound in play flow when round completes (nextQuestion)
- Celebrate when goal reached
