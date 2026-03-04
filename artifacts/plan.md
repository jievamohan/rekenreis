# Plan: 0001-bootstrap-tooling

## Task Contract Validation

| Item | Status |
|------|--------|
| scope_in | ✓ scripts/config for gates C, D, F; web/api scripts; CI; artifacts |
| scope_out | ✓ no game logic |
| acceptance criteria | ✓ 4 items |
| lanes | ✓ I, W2, A2, T |
| gates | ✓ C, D, F |

**Prerequisite**: apps/web and apps/api do not exist. Lane I must scaffold minimal app structure first.

## Wave 0: Shared Setup

- [x] Create /artifacts directory
- [ ] Create docs/runbooks/commands.md (canonical command list)

## Wave 1: Lane I (deps/infra)

### 1.1 Scaffold apps/web (Nuxt 3 + Vue 3 + TypeScript)
- Create apps/web via `pnpm create nuxt-app` or manual minimal structure
- package.json with: lint, typecheck, test, build, size scripts

### 1.2 Scaffold apps/api (Laravel)
- Create apps/api via `composer create-project` or manual minimal structure
- composer.json / Makefile with: phpstan, test, audit scripts

### 1.3 CI Workflow
- .github/workflows/gates.yml: runs gates on PR (typecheck, phpstan, lint, audit, build, size)

### 1.4 Artifacts path
- Ensure /artifacts exists (with .gitkeep if needed)

## Wave 2: Lane W2 (typecheck) + Lane A2 (phpstan)

- W2: Wire vue-tsc or nuxt typecheck in apps/web
- A2: Wire PHPStan in apps/api (phpstan.neon, composer script)

## Wave 3: Lane T (test harness)

- Minimal smoke: `pnpm run typecheck` and `composer run phpstan` (or equivalent) succeed
- artifacts/tests.md with commands and results

## Gate Artifacts (post-implementation)

- typecheck.md (Gate C)
- security.md (Gate D: gitleaks, semgrep, pnpm audit, composer audit)
- perf.md (Gate F: bundle-size baseline, build)
- tests.md
- review.md
- pr.md

## Branch Strategy

- Single branch for bootstrap (no per-lane branches; task is infra-only)
- Branch: `feat/0001-bootstrap-tooling` (per 05-branch-discipline)
