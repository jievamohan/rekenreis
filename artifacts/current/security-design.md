# Security & Privacy — Epic 28: New Minigame (Replace Coral)

## New Risks Introduced

**None.** No new auth, payments, external APIs, or data collection.

## Config Constraints

- Minigame receives question (a, b, correctAnswer, choices) — same as existing
- No new config or env vars

## Data Handling

- No new persistence
- Same session/local state as other minigames

## Checks Required

- No secrets or PII in new code
- Dependency audit unchanged (no new deps)
- SAST/gitleaks: no new findings
