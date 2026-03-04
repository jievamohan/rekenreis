# Discovery: ZAP Workflow Speed Optimization

## Problem Statement

The OWASP ZAP Baseline job in `.github/workflows/gates.yml` takes ~6 minutes per run. Per epic iteration, this action runs twice (pre-squash and post-squash), totaling ~12 minutes of wait time. This is excessive for developer feedback loops.

**Target:** Reduce ZAP gate to ≤90 seconds (ideally ≤60 seconds).

## Current State (from CI logs run-22682977290)

| Phase | Duration | Notes |
|-------|----------|-------|
| Checkout | ~5s | |
| Buildx setup | ~2s | |
| MySQL cache | ~2s hit / ~20s miss | actions/cache + docker save/load |
| ZAP cache | ~2s hit / ~60s miss | ZAP image ~600MB; cache often misses |
| Build web | ~60-120s | pnpm install + build; buildx GHA cache |
| Build api | ~60-120s | composer + php-ext; buildx GHA cache |
| Start stack | ~5s | docker compose up --no-build |
| Wait for health | ~16-120s | sleep 5 + 36×5s curl loop |
| Security headers | ~5s | curl-based check |
| ZAP baseline (4 runs) | ~180s | Sequential: web/start, web/play, api/health, api/session-stats |
| Teardown | ~15s | docker compose down |

**Total cold run:** ~6-7 min. **Warm run (cache hit):** ~4-5 min.

## Root Causes

1. **Docker image caches not reliable:** MySQL and ZAP use `actions/cache` with static keys; cache eviction or first-run = full pull (~30s ZAP, ~20s MySQL).
2. **Sequential builds:** Web and API built one after another.
3. **Sequential ZAP scans:** 4 ZAP runs × ~45s each = ~3 min.
4. **Health wait conservative:** 36×5s = 180s max; typically 15-30s.
5. **ZAP spider time:** `-m 2` = 2 min max per target; each run spiders then passive-scans.

## Images/Containers Used

| Image | Source | Size (approx) | Cached? |
|-------|--------|---------------|---------|
| mysql:8.0 | Docker Hub | ~500MB | actions/cache (docker save) |
| ghcr.io/zaproxy/zaproxy:stable | GHCR | ~600MB | actions/cache (docker save) |
| node:22-alpine | Docker Hub | ~50MB | buildx GHA (web base) |
| php:8.4-cli-alpine | Docker Hub | ~100MB | buildx GHA (api base) |
| composer:latest | Docker Hub | ~200MB | buildx GHA (api COPY) |
| rekenreis-web:latest | Built | ~300MB | buildx GHA |
| rekenreis-api:latest | Built | ~400MB | buildx GHA |

## Constraints

- Must scan PR code (not main); cannot skip build.
- ZAP baseline coverage: web /start, /play; api /api/health, /api/session-stats.
- Security headers check must run against live stack.
- No destructive DB ops; reversible changes only.
