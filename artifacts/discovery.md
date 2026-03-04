# Epic 14 — Production Hardening 2 (DAST, Security Regression, CI Speed): Discovery

## Feature Summary

Strengthen security/testing hardening and CI speed. Extend OWASP ZAP baseline coverage, add regression tests for security headers/cookies/CORS, add CI caching improvements (pnpm/composer) without weakening integrity, reduce flaky e2e further, and update docs/runbooks.

## Problem Statement

1. **ZAP coverage is minimal**: Only `/start` (web) and `/api/health` (api) are scanned. Key user-facing routes (e.g. `/play`) and API endpoints (e.g. `/api/session-stats`) are not covered.
2. **Security regression gaps**: ZAP uses `|| true` so it never fails. No deterministic regression tests for headers (X-Frame-Options, X-Content-Type-Options), cookies, or CORS. CI logs show X-Content-Type-Options warnings on some routes.
3. **CI speed**: pnpm has cache via setup-node; composer has no explicit cache—every job runs `composer install` from scratch.
4. **Flakiness**: ZAP job uses fixed sleeps (8s, 15s) and a 36-retry health loop. Stack startup can be slow; no retry/backoff for ZAP itself.
5. **Docs**: runbooks may not reflect new ZAP coverage, cache behavior, or security test expectations.

## Current State

### gates.yml
- **gate-c-typecheck**: pnpm cache via setup-node; composer install (no cache)
- **gate-d-security**: pnpm cache; composer install (no cache); ZAP not in this job
- **gate-f-build**: pnpm cache
- **zap-baseline**: compose up, sleep 8+15, health loop (36×5s), ZAP against web:3000/start and api:8000/api/health; `|| true` so never fails
- **lint-test**: pnpm cache; composer install (no cache)

### ZAP
- Targets: `http://web:3000/start`, `http://api:8000/api/health`
- Options: `-I` (ignore warnings), `-m 2` (2 min timeout)
- Reports: web-report.json/html, api-report.json/html in artifacts/zap (gitignored)

### Security
- **Web**: nuxt.config.ts sets X-Frame-Options, X-Content-Type-Options via routeRules
- **API**: Laravel + fruitcake/php-cors; default CORS
- **Tests**: apps/web/test/security.test.ts—config-only assertions, no HTTP
- **CI logs**: X-Content-Type-Options Header Missing [10021] on some routes

### E2E
- No playwright/cypress
- Manual smoke in docs/runbooks/commands.md
- ZAP job is the closest automated “e2e” (stack + HTTP probes)

## Requirements (from Epic)

1. Extend OWASP ZAP baseline coverage
2. Add regression tests for security headers/cookies/CORS
3. Add CI caching improvements (pnpm/composer) without weakening integrity
4. Reduce flaky e2e further
5. docs/runbooks update

## Non-Goals

- Feature work
- New e2e framework (playwright/cypress)
- ZAP active scanning

## Constraints

- Lanes: **I only** (deps/infra/CI)
- Gates: C, D, F
- Max 5 tasks
- Risks: ci, infra

## Key Files

- `.github/workflows/gates.yml` — CI jobs, ZAP, caching
- `scripts/ci/` — policy-check, future security-header script
- `docs/runbooks/commands.md` — canonical commands, smoke
- `docker-compose.yml`, `docker-compose.ci.yml` — stack for ZAP

## Key URLs for ZAP Extension

| App | Current | Candidates to add |
|-----|---------|-------------------|
| web | /start | /play, /play?mode=classic |
| api | /api/health | /api/session-stats (POST) |

## Caching Options (integrity-preserving)

- **pnpm**: Already cached via setup-node; verify cache key includes lockfile hash
- **composer**: Use `actions/cache` with key from `composer.lock` hash; restore before `composer install`; `--prefer-dist --no-interaction` for speed
