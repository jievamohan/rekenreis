# CI Images Publish

## Overview

Web, API, and E2E images are prebuilt and published to GHCR. The PR Playwright gate pulls these images and does not build locally.

## Bootstrap

Before the first PR can pass the e2e gate, images must exist in GHCR. Either:

1. **Push to main** – The publish workflow runs on push to main when relevant paths change.
2. **Manual trigger** – Run the "Publish images" workflow via `workflow_dispatch` to build and push all images.

## Image locations

- `ghcr.io/jievamohan/rekenreis/web:latest`
- `ghcr.io/jievamohan/rekenreis/api:latest`
- `ghcr.io/jievamohan/rekenreis/e2e:latest`

## Trigger rules (path-based)

| Image | Triggers |
|-------|----------|
| web | `docker/web.Dockerfile`, `docker-compose*.yml`, `docker-bake.hcl`, `apps/web/**` |
| api | `docker/api.Dockerfile`, `docker-compose*.yml`, `docker-bake.hcl`, `apps/api/**` |
| e2e | `docker/e2e.Dockerfile`, `docker-compose*.yml`, `docker-bake.hcl`, `apps/web/package.json`, `apps/web/pnpm-lock.yaml`, `apps/web/playwright.config.ts`, `apps/web/e2e/**` (not `apps/web/**` — web image covers app source) |

## Verification

- **Web/API**: Source is baked into the image; no volume mount in CI.
- **E2E**: Tests and `node_modules` are baked in; no `pnpm install` at runtime.
