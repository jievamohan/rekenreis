# PR Summary: 0001-bootstrap-tooling

## Title

Bootstrap tooling: gates C, D, F for web and API

## Summary

Establishes baseline scripts and CI for quality gates before any game logic.

## Changes

### apps/web (Nuxt 3 + Vue 3 + TypeScript)
- Minimal Nuxt 3 app with package.json scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `size`
- ESLint, Vitest, vue-tsc configured

### apps/api (Laravel)
- Laravel 12 app with composer scripts: `phpstan`, `test`, `audit-deps`
- Larastan (PHPStan) level 5

### CI
- `.github/workflows/gates.yml`: typecheck, security (gitleaks, audits), build, lint-test

### Docs
- `docs/runbooks/commands.md`: canonical command list

### Artifacts
- `/artifacts`: plan.md, risk.md, typecheck.md, security.md, perf.md, tests.md, review.md, pr.md

## Acceptance Criteria

- [x] Web: lint, typecheck, test, build, size scripts
- [x] API: phpstan, test, audit-deps scripts
- [x] CI runs gates on PR
- [x] /artifacts path exists

## Known Issues

- **pnpm audit**: 13 vulns in web deps (Nuxt 3.13.2, transitive). Documented in security.md. Upgrade Nuxt to ≥3.16 in follow-up.
- **audit script**: Composer reserves `audit`; we use `audit-deps` (runs `composer audit`)

## Branch

Current: `feat/0001-bootstrap-tooling`. Open PR to `master`.
