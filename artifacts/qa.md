# Epic 12 — Rewards Expansion: QA

## Test Cases

1. **Daily reset**: Mock date change; rounds reset to 0
2. **Daily goal**: Play 5 rounds; goal reached; celebration
3. **Sticker book**: Unlocked stickers visible; locked show lock
4. **Per-profile**: Profile A has progress; Profile B separate
5. **Timezone**: Use local date (manual test or mock Intl)

## Acceptance

- Unit tests: useDailyGoal (reset, increment, goal)
- Unit tests: sticker display logic
- E2E optional: play 5 rounds, see goal reached
