# Playwright e2e Benchmark

## Step Timing (Epic 24.1)

The e2e-container job outputs duration per step to the job summary:

| Step | Description | Typical (cache hit) | Typical (cache miss) |
|------|-------------|---------------------|----------------------|
| Pull/Load images | docker pull or docker load | ~5–15s | ~60–80s |
| Start stack | docker compose up + wait | ~15–25s | ~15–25s |
| Run Playwright | e2e tests in container | ~35–45s | ~35–45s |

**Spinup** = Pull/Load + Start. **Target:** < 60s total via image cache.

### Image cache (PR gate)

- **No build in PR:** Images are prebuilt by `publish-images` workflow and pulled from GHCR.
- **Cache:** `actions/cache` + `docker save`/`docker load` for web, api, e2e, mysql.
- **Key:** `docker-e2e-stack-${{ base.sha }}` for PRs (re-run same PR = cache hit); unique for push to main.
- **Cache hit:** Load from cache (~5–15s) instead of pull (~60–80s).

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

## Epic 24 — Spinup Optimization (Final)

| Slice | Change | Status |
|-------|--------|--------|
| 24.1 | Step timing in job summary | Done |
| 24.2 | Full stack image cache (web, api, e2e, mysql) | Done |
| 24.3 | Pull-only PR gate (no build; GHCR images) | Done |
| 24.4 | docker save/load cache for e2e job | Done |

**Spinup on cache hit:** ~20–40s (pull+start). **On cache miss:** ~80–100s. Cache key = PR base sha; re-run same PR = cache hit.

## Epic 25 — Install Optimization (Final)

| Slice | Change | Status |
|-------|--------|--------|
| 25.1 | Step timing (install vs test substeps) | Done |
| 25.2 | Custom e2e image with pnpm pre-installed | Done |
| 25.3 | Remove runtime npm install -g pnpm | Done |
| 25.4 | Fine-tune & document final config | Done |

| Substep | Description | Typical (cache hit) | Typical (cache miss) |
|---------|-------------|---------------------|----------------------|
| Install (pnpm) | pnpm config + pnpm install (when needed) | ~0–2s | ~30–60s |
| Run Playwright | pnpm test:e2e | ~30–60s | ~30–60s |

**Final Config (Epic 25.4):**

- **e2e image:** Custom `rekenreis-e2e:latest` (FROM playwright + pnpm@9); built via bake, GHA cache `scope=e2e`
- **Runtime:** No `npm install -g pnpm`; pnpm pre-installed in image
- **node_modules:** Cached at job level; on cache hit, install substep is config-only (~0–2s)
- **Target achieved:** Install substep nagenoeg instant on cache hit
