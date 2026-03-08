# QA — Epic 28 (QA Strategist)

## Unit Tests

1. **computeStars:** All threshold boundaries (0, 1, 2, 3 stars for given correctCount/totalRounds)
2. **useLevelProgress.completeLevel:** Accept stars 0; keep best on replay; never decrease
3. **profileSchema:** Accept stars 0 in levelProgress validation

## E2E

1. **Level complete:** Play level with mixed correct/wrong → verify star count in modal
2. **Replay:** Complete level with 1 star, replay and get 3 stars → map shows 3
3. **Replay no regression:** Complete with 3 stars, replay with 1 star → map still shows 3

## Non-Flaky Assertions

- Use deterministic correct/wrong sequence (e.g. answer first 3 wrong, rest correct → verify 1 star)
- Avoid timing-dependent checks

## Visual Regression

- LevelCompleteModal with 0 stars (if UI differs)
- Map node with 0 stars (if different from 1 star)
