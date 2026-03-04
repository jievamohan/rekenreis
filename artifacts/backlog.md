# Epic 4 Backlog

## Epic Summary
Persistence (localStorage, versioned) + optional API telemetry + privacy UI.

## Scope_in
- Versioned persistence schema + migration
- API POST /api/session-stats (anonymous)
- Privacy notes + opt-out switch
- Tests for schema/versioning

## Scope_out
- Auth; PII; complex analytics

## Risks
- privacy: telemetry must be opt-out clear
- db: session-stats may need migration if stored

## Task List
1. **0021-persistence-schema** — Versioned schema + migration [W2]
2. **0022-api-session-stats** — POST /api/session-stats [A1, A2]
3. **0023-privacy-optout** — Privacy notes + opt-out switch [W1]
4. **0024-persistence-tests** — Schema/versioning tests [T]
