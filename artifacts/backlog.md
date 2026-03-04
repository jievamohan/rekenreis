# Epic 14 — Production Hardening 2 (DAST, Security Regression, CI Speed): Backlog

## Epic Summary

Strengthen security/testing hardening and CI speed. Extend OWASP ZAP baseline coverage, add regression tests for security headers/cookies/CORS, add CI caching improvements (pnpm/composer) without weakening integrity, reduce flaky e2e further, and update docs/runbooks.

## Scope In

- Extend ZAP baseline to additional URLs (web: /play or equivalent; api: /api/session-stats or equivalent)
- Add CI script/job step for security headers regression (X-Frame-Options, X-Content-Type-Options, CORS) against running stack
- Add composer cache in CI (actions/cache keyed by composer.lock hash)
- Reduce ZAP job flakiness: improve health wait, retries, or timeout tuning
- Update docs/runbooks/commands.md for new ZAP coverage, cache behavior, security regression

## Scope Out

- Feature work
- New e2e framework (playwright/cypress)
- ZAP active scanning
- Trivy image scan
- Changes to app code (W1, W2, A1, A2) except config required for tests

## Risks + Mitigations

| Tag | Risk | Mitigation |
|-----|------|------------|
| ci | Cache poisoning / stale deps | Cache key includes lockfile hash; frozen-lockfile / --no-update |
| ci | ZAP job timeout or flakiness | Tune health wait; consider fail-fast vs continue-on-error |
| infra | Composer cache key collision | Use `composer.lock` content hash |

## NFRs

- Gates: C (typecheck), D (security), F (bundle budget)
- Lanes: **I only** (deps/infra/CI)
- Max 5 tasks

## Task List

| # | Title | Lanes | Gates |
|---|-------|-------|-------|
| 0075 | zap-baseline-coverage | I | C, D, F |
| 0076 | security-headers-regression-ci | I | C, D, F |
| 0077 | composer-cache-ci | I | C, D, F |
| 0078 | zap-job-reliability | I | C, D, F |
| 0079 | docs-runbooks-epic14 | I | C, D, F |
