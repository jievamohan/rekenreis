# Epic 12 — Rewards Expansion: Backlog

## Epic Summary

Expand rewards into sticker book and optional daily goal. Per-profile. Celebratory, never blocks play.

## Scope In

- Profile progress: dailyGoal { date, roundsPlayed }
- useDailyGoal composable: timezone-safe today, increment, reset
- Sticker book page: categories, locked/unlocked, "new" highlight
- Daily goal widget on play: rounds/goal, celebrate when reached
- Wire incrementRound when round completes

## Scope Out

- Monetization
- Leaderboards

## Risks + Mitigations

| Tag | Risk | Mitigation |
|-----|------|------------|
| perf | Bundle growth | No new heavy deps; use native Date |

## NFRs

- Perf: minimal bundle impact
- A11y: sticker book keyboard nav

## Task List

| # | Title | Lanes | Gates |
|---|-------|-------|-------|
| 0065 | daily-goal-schema | W2 | C, D, F |
| 0066 | useDailyGoal-composable | W2 | C, D, F |
| 0067 | sticker-book-config-page | W2, W1 | C, D, F |
| 0068 | daily-goal-play-integration | W1, W2 | C, D, F |
| 0069 | rewards-expansion-tests | T | C, D, F |
