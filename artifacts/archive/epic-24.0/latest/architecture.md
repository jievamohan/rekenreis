# Architecture — Epic 24 (Principal Architect)

## Current State

### e2e-container job (.github/workflows/gates.yml)

1. **Cache pnpm store** — key: pnpm-store-{os}-{lockfile hash}
2. **Cache node_modules** — key: node-modules-{os}-{lockfile hash}
3. **Cache Playwright image** — key: docker-playwright-v1.49.0-jammy
4. **Build images (cached)** — docker/bake-action, targets web+api, GHA cache scope=web, scope=api
5. **Start stack (no rebuild)** — `docker compose up --no-build -d web api mysql` + `up --wait`
6. **Run Playwright** — scripts/ci/e2e-benchmark.sh

### Gap Analysis

- **MySQL image:** e2e-container heeft GEEN MySQL cache. zap-baseline job WEL (lines 278–291). Bij `docker compose up` wordt mysql:8.0 elke keer gepulled.
- **Build cache:** docker/bake-action gebruikt `cache-from=type=gha,scope=web` etc. Mogelijke oorzaken van cache miss:
  - Cache key niet stabiel tussen PRs/branches
  - Bake cache-to/cache-from scope mismatch
  - GHA cache eviction (7-day policy)

## Constraints

- Container-only Playwright (policy 64)
- Gate C/D/F moeten groen blijven
- Geen wijziging aan test logic
