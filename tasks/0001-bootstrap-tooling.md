---
id: "0001"
title: "bootstrap-tooling"
status: done
scope_in:
  - scripts/config to satisfy gates C, D, F for apps/web and apps/api
  - web: lint, typecheck, test, build, size scripts
  - api: phpstan, test, audit scripts
  - CI pipeline that runs gates on PR
  - /artifacts generation path
scope_out:
  - any game/application logic
lanes:
  - I (deps/infra) for scripts/config/CI
  - W2 minimal if needed for typecheck wiring
  - A2 minimal if needed for phpstan wiring
  - T for minimal test harness
gates:
  - C: typecheck (web), PHPStan (api)
  - D: gitleaks, semgrep, pnpm audit, composer audit
  - F: bundle-size budget, build success
---

# Bootstrap Tooling

Baseline scripts/config via this tooling ticket before any game logic (Step 6).

## Acceptance Criteria

- [x] **Web (apps/web)**: lint, typecheck, test, build, size scripts
- [x] **API (apps/api)**: phpstan, test, audit-deps scripts (Composer reserves `audit`)
- [x] **CI**: runs gates on PR
- [x] **Artifacts**: `/artifacts` path exists and is used for plan.md, risk.md, typecheck.md, security.md, perf.md, tests.md, review.md, pr.md

## Subtasks (by lane)

### Lane I (deps/infra)
- Add/configure scripts in apps/web package.json: lint, typecheck, test, build, size
- Add/configure scripts in apps/api composer.json or Makefile: phpstan, test, audit
- Create CI workflow (e.g. .github/workflows/gates.yml) that runs gates on PR
- Ensure docs/runbooks/ exists with canonical command list (or create if missing)
- Create /artifacts directory (or .gitkeep)

### Lane W2 (minimal)
- Wire typecheck for web (e.g. vue-tsc, nuxt typecheck) if not present

### Lane A2 (minimal)
- Wire PHPStan for api if not present

### Lane T
- Minimal test harness for web and api (smoke tests to verify scripts run)
