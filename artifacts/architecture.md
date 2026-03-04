# Epic 13 — Share/Print Progress Summary: Architecture

## Data Model Changes

### ProfileProgress Extension

```ts
// Current
progress: {
  bestScore: number
  dailyGoal?: { date: string; roundsPlayed: number }
}

// Extended (v1)
progress: {
  bestScore: number
  dailyGoal?: { date: string; roundsPlayed: number }
  // New: session history for accuracy + total rounds + mode usage
  sessionHistory?: Array<{
    date: string           // YYYY-MM-DD local
    roundsPlayed: number
    correct: number
    wrong: number
    timeout: number
    modeCounts: Record<InteractionModeId, number>
  }>
}
```

**Alternative (simpler)**: Store rolling aggregates instead of full history to bound storage:

```ts
progress: {
  bestScore: number
  dailyGoal?: { date: string; roundsPlayed: number }
  // Rolling totals (all-time or last N days)
  totalRounds?: number
  totalCorrect?: number
  totalWrong?: number
  totalTimeout?: number
  modeCounts?: Record<InteractionModeId, number>
}
```

Recommendation: **Rolling aggregates** for v1 — simpler, bounded, sufficient for summary.

### Migration

- Existing profiles: new fields undefined; init to 0 on first use
- No schema version bump if we only add optional fields

## Composables

### useProgressSummary(profile?)

- **Input**: ProfileApi (activeProfile, updateProfile)
- **Output**:
  - `roundsToday`: number (from dailyGoal)
  - `roundsTotal`: number (from totalRounds)
  - `accuracy`: number (0–100, correct / total answered)
  - `favoriteMode`: InteractionModeId (mode with highest count, else lastMode)
  - `copyToClipboard()`: async, returns success
  - `downloadJson()`: triggers download

### useRoundOutcome(profile?)

- Called from play.vue when round completes (onNext)
- Records: correct/wrong/timeout + current mode
- Updates profile: totalRounds++, totalCorrect/totalWrong/totalTimeout++, modeCounts[mode]++

## Flow

1. **Play round** → feedback (correct/wrong/timeout) → onNext → useRoundOutcome.record(outcome, mode)
2. **Summary page** → useProgressSummary → read aggregates → render
3. **Export** → useProgressSummary.copyToClipboard() or downloadJson()

## Integration Points

- `play.vue`: call `recordRoundOutcome(outcome, mode)` in onNext (alongside incrementRound)
- `usePlayGame`: no change; play.vue reads feedback and passes to recorder
- New page: `pages/summary.vue`
- Nav: add link to /summary from play and/or settings
