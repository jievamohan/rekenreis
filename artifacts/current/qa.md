# QA — Epic 24 (QA Strategist)

## Test Strategy

- **Invariant:** Alle bestaande Playwright tests blijven groen.
- **Geen wijziging aan test logic** — alleen CI-infra.

## Regression Plan

1. Na elke slice: CI run op PR; e2e-container job moet slagen.
2. Verifieer dat `docker compose run --rm e2e` lokaal nog werkt (policy 64).
3. Geen nieuwe flakiness door cache — bij cache miss moet job nog steeds slagen (fallback naar pull/build).

## Checks Required

- e2e-container job: alle Playwright specs pass
- Gate C, D, F: ongewijzigd groen
- Runbook bijgewerkt met nieuwe timings
