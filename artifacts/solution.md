# Epic 13 — Share/Print Progress Summary: Solution

## 1. Profile Schema Extension

Add optional aggregates to `ProfileProgress`:

```ts
progress: {
  bestScore: number
  dailyGoal?: { date: string; roundsPlayed: number }
  totalRounds?: number
  totalCorrect?: number
  totalWrong?: number
  totalTimeout?: number
  modeCounts?: Partial<Record<InteractionModeId, number>>
}
```

- Migration: existing profiles get undefined; treat as 0 in computations
- `isValidV1`: allow new optional fields; do not require them

## 2. useRoundOutcome Composable

- `useRoundOutcome(profile?)`
- `recordRoundOutcome(outcome: 'correct' | 'wrong' | 'timeout', mode: InteractionModeId)`
- Reads active profile, merges updates into progress aggregates, calls updateProfile
- Called from play.vue in onNext, after feedback is available

## 3. useProgressSummary Composable

- `useProgressSummary(profile?)`
- Computed: `roundsToday`, `roundsTotal`, `accuracy` (0–100), `favoriteMode`
- `copyToClipboard()`: build sanitized JSON/text, `navigator.clipboard.writeText()`
- `downloadJson()`: create Blob, trigger download via temporary anchor
- Export format: `{ roundsToday, roundsTotal, accuracy, favoriteMode, exportedAt }` — no id, no name

## 4. Summary Page

- Route: `/summary`
- Component: `pages/summary.vue`
- Uses useProgressSummary; displays metrics in card layout
- Buttons: "Copy summary", "Download JSON"
- Print-friendly CSS (optional media query)

## 5. Play Integration

- In play.vue onNext: after `dailyGoal.incrementRound()`, call `recordRoundOutcome(outcome, mode)`
- Derive outcome from `game.feedback.value`: correct → 'correct', !correct → 'wrong', type 'timeout' → 'timeout'
- Pass `interactionMode` (InteractionModeId) for mode tracking
