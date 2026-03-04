# CI Speed Optimization: Discovery

## Feature Summary

Versnel GitHub Actions door Docker image cache en andere optimalisaties. Docker images worden nu elke run opnieuw gebouwd in de zap-baseline job; dat moet vanuit cache kunnen.

## Current State

### Jobs
| Job | Duur (schatting) | Wat doet |
|-----|------------------|----------|
| gate-c-typecheck | ~1–2 min | pnpm + composer (cached), typecheck, phpstan |
| gate-d-security | ~2–3 min | policy, gitleaks, semgrep, pnpm/composer (cached), hadolint, trivy |
| gate-f-build | ~1–2 min | pnpm (cached), build, size |
| zap-baseline | ~4–6 min | **docker compose up** (builds web + api from scratch), health wait, ZAP, teardown |
| lint-test | ~1–2 min | pnpm (cached), composer (cached), lint, test |

### Docker Build (zap-baseline)
- `docker compose up -d` bouwt web en api images **zonder cache**
- Elke run: volledige rebuild van node:22-alpine (pnpm install) en php:8.4-cli-alpine (composer install)
- Geen BuildKit cache, geen layer reuse

### Bestaande caches
- pnpm: setup-node cache (gate-c, gate-d, gate-f, lint-test)
- composer: actions/cache (gate-c, gate-d, lint-test)

## Probleem

1. **Docker images**: zap-baseline bouwt web + api elke run opnieuw (~2–4 min extra)
2. **Geen Docker layer cache**: pnpm install en composer install in Dockerfile draaien elke keer
3. **Mogelijke winst**: pip/semgrep cache in gate-d; hadolint/trivy image pull (eerste run)

## Oplossing

### 1. Docker Buildx + GHA cache (zap-baseline)
- `docker/setup-buildx-action@v3`
- Build web en api met `docker/build-push-action` (load: true, cache-from/to: type=gha)
- `docker compose up --no-build` i.p.v. `up --build`
- Cache key: hash van Dockerfile + package.json/composer.lock

### 2. Pip cache (gate-d)
- Cache pip packages (semgrep): `~/.cache/pip` of `actions/cache` met pip
- Of: `pip install --cache-dir` + actions/cache

### 3. Overige
- Hadolint/trivy: images worden gepulled; eerste run traag, daarna cached door Docker
- fetch-depth: 0 alleen voor gate-d (gitleaks); andere jobs kunnen default gebruiken

## Non-Goals

- CI job merging (parallel blijft sneller)
- ZAP job verwijderen
- Build matrix wijzigen
