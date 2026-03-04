# Epic 14 — Infra/CI Review

## Changes

- **gates.yml**: Extended ZAP baseline (web /play, api /api/session-stats); composer cache; security-headers-check step; improved health wait (40×3s, reduced sleeps)
- **scripts/ci/security-headers-check.sh**: New script asserting X-Frame-Options, X-Content-Type-Options (web), CORS (api)
- **docs/runbooks/commands.md**: Documented ZAP targets, security-headers-check, CI caching

## Integrity

- Composer cache key: `composer-${{ hashFiles('apps/api/composer.lock') }}` — lockfile authoritative
- pnpm: unchanged (setup-node cache)
- No weakening of lockfile or dependency resolution

## Rollback

- Revert gates.yml and scripts/ci/security-headers-check.sh
- Composer cache is ephemeral; no persistent state
