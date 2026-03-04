---
id: "0077"
title: "composer-cache-ci"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add actions/cache for composer vendor directory in CI"
  - "Cache key includes hash of apps/api/composer.lock"
  - "Restore cache before composer install; save after"
  - "Preserve integrity: use --no-update or equivalent so lockfile is authoritative"
scope_out:
  - "pnpm cache changes (already cached via setup-node)"
  - "Cache for other tools"
  - "Weakening lockfile integrity"
acceptance:
  - "Composer cache step in gate-c-typecheck, gate-d-security, lint-test (all jobs that run composer install)"
  - "Cache key: composer-${{ hashFiles('apps/api/composer.lock') }}"
  - "composer install uses --no-interaction --prefer-dist"
  - "CI passes; no cache poisoning"
  - "Gates C, D, F pass"
lanes:
  - name: "I"
    files: [".github/workflows/gates.yml"]
gates: ["C", "D", "F"]
risks: ["ci", "infra"]
---

## Context

Epic 14: CI caching improvements. pnpm has cache; composer has none. Add composer cache without weakening integrity.

## Dependencies

- None. Pure CI change.
