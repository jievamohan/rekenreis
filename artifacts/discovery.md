# Epic 4 Discovery

## Summary
Persist progress locally (localStorage) with versioning/migration; optional API telemetry for anonymous session stats; privacy notes and opt-out.

## Current State
- useRewards: stores best_score in localStorage (single key, no versioning)
- No migration path; no structured progress schema
- API: GET /api/health only
- No privacy UI

## Scope
- **In**: Versioned persistence schema, migration, API session-stats (anonymous), privacy UI, tests
- **Out**: Auth, PII, complex analytics
