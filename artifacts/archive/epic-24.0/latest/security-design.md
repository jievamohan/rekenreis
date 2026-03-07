# Security Design — Epic 24 (Security/Privacy)

## New Risks

- **Laag.** Alleen CI caching en image handling.
- Geen wijziging aan applicatiecode, auth, of data.

## Config Constraints

- Cache keys moeten deterministisch zijn (geen secrets).
- MySQL image: officiële mysql:8.0 — geen custom images.
- GHA cache: scope per job; geen cross-repo exposure.

## Checks Required

- Gate D (gitleaks, semgrep, audit) blijft groen.
- Geen secrets in cache paths.
