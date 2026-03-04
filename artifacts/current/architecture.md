# Architecture: ZAP Workflow Optimization

## Current Flow

```
checkout → buildx → cache mysql → cache zap → build web → build api
  → compose up → wait health → security-headers → ZAP×4 → teardown
```

## Proposed Flow (optimized)

```
checkout → buildx → [parallel: cache mysql | cache zap]
  → buildx bake (web + api parallel)
  → compose up → wait health (tighter) → security-headers
  → ZAP×4 parallel (background jobs)
  → teardown
```

## Key Changes

1. **Buildx bake:** Single `docker buildx bake` for web+api in parallel.
2. **Cache hardening:** Add `restore-keys` for mysql/zap; ensure cache save on success.
3. **Parallel ZAP:** Run 4 ZAP containers in parallel via `&` and `wait`.
4. **Health wait:** Reduce to 5s + 12×2s = 29s max (from 5+36×5=185s).
5. **ZAP -m flag:** Consider `-m 1` (1 min) if acceptable for baseline; saves ~1 min per run.
6. **Artifactory (optional):** If org has Artifactory, use as Docker registry cache for mysql/zap; pull from local mirror faster than Docker Hub/GHCR.
