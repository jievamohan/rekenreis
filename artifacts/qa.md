# Epic 13 — Share/Print Progress Summary: QA

## Test Strategy

### Unit Tests (T lane)

1. **useRoundOutcome**
   - recordRoundOutcome increments totalRounds, totalCorrect/totalWrong/totalTimeout
   - modeCounts updated per mode
   - Handles undefined profile gracefully

2. **useProgressSummary**
   - roundsToday from dailyGoal when date matches
   - roundsTotal from totalRounds (0 when undefined)
   - accuracy = correct / (correct + wrong + timeout) * 100; 0 when no rounds
   - favoriteMode: highest modeCount, else lastMode fallback
   - copyToClipboard: returns success; payload has no id/name
   - downloadJson: triggers download (mock or spy)

3. **Summary aggregation correctness**
   - Given mock profile with known totals, summary values match
   - Edge: all zeros, all timeouts, single mode

### Integration / E2E (optional)

- Play a few rounds → open /summary → values reflect play
- Copy to clipboard → paste → JSON valid, no identifiers

## Acceptance Criteria

- Unit tests for useRoundOutcome and useProgressSummary
- Summary aggregation correctness tests pass
- Typecheck passes (Gate C)
- No new security findings (Gate D)
- Bundle budget passes (Gate F)
