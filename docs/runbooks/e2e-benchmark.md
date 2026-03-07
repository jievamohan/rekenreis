# Playwright e2e Benchmark

## Baseline (Epic 23.1)

- **Metric:** Duration of the "Run Playwright tests" step in the e2e-container CI job.
- **Current baseline:** ~120–150 seconds (2+ minutes), including:
  - pnpm install inside e2e container
  - Playwright test execution (all projects: chromium + visual)
- **Target (Epic 23):** < 60 seconds total.

## How It Works

1. **CI:** `scripts/ci/e2e-benchmark.sh` wraps the Playwright run and records duration.
2. **Output:** Duration is written to:
   - `artifacts/ci/e2e-duration-seconds.txt`
   - GitHub Actions job summary (when in CI)
3. **Artifact:** `e2e-benchmark` artifact contains the duration file.

## Local Benchmark

To measure locally (requires stack running):

```bash
# Start stack first
docker compose -f docker-compose.yml -f docker-compose.ci.yml up -d web api mysql
docker compose -f docker-compose.yml -f docker-compose.ci.yml up --wait web api mysql

# Run benchmark script
bash scripts/ci/e2e-benchmark.sh
```

## Optimization Roadmap (Epic 23)

| Slice | Change | Status |
|-------|--------|--------|
| 23.2 | Workers 2–4, visual-only for visual specs | Done: workers=4 |
| 23.3 | pnpm cache, optimize slow tests | Done |
| 23.4 | Deduplicate tests, fine-tune | Done: workers=4, final config |

## Final Config (Epic 23.4)

- **Workers:** 4 in CI
- **Projects:** chromium (functional, excludes visual), visual (e2e/visual/* only)
- **node_modules:** Cached; e2e skips install when present
- **mistakes-review:** Reduced timeouts
