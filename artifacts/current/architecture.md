# Architecture — Epic 23: Playwright CI Speed

## Current Architecture

### CI Pipeline (.github/workflows/gates.yml)

- **e2e-container job:** Runs Playwright tests inside Docker.
- **Flow:**
  1. Checkout
  2. Docker Buildx
  3. Cache pnpm store
  4. Cache Playwright image (mcr.microsoft.com/playwright:v1.49.0-jammy)
  5. Build web + api images (docker/bake-action)
  6. Start stack (web, api, mysql)
  7. Run e2e: `docker compose run --rm e2e` → pnpm install + pnpm test:e2e
  8. Upload report, tear down

### Playwright Config (apps/web/playwright.config.ts)

- `workers: 1` in CI (sequential execution)
- `projects: chromium, visual` — tests run twice (once per project)
- `fullyParallel: true` (but workers=1 negates parallelism)
- `retries: 1` in CI

### Test Suite

- ~11 spec files, ~35+ test cases
- Two projects → ~70 test runs
- Slow file: mistakes-review.spec.ts (~30s)
- Visual project duplicates functional tests with different viewport

### Bottlenecks (from benchmark)

1. **Workers=1:** All tests run sequentially.
2. **Dual projects:** chromium + visual run same tests twice.
3. **pnpm install:** Inside e2e container every run (no layer caching of node_modules).
4. **Stack startup:** web, api, mysql healthchecks add latency.
5. **Docker image pulls:** Playwright base image ~1.5GB.
6. **Build:** web/api images built each run (GH cache helps but cold cache is slow).

## Target Architecture

- Playwright job wall-clock < 60s.
- Preserve test coverage and reliability.
- Container-only execution (policy: 64-container-only-playwright).
