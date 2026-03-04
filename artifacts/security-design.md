# Epic 9 — Adaptive Assistance: Security Design

## Risk Assessment

- **Low**: No auth, payments, or sensitive data
- **Persistence**: localStorage only; no PII
- **Input**: Assistance state derived from in-game feedback; no user input to assistance logic

## Mitigations

- Persist only numeric state (wrongStreak, lastReset); no identifiers
- Hint content comes from question data (already validated)
- No external API calls in assistance flow
