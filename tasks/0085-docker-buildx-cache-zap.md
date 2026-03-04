---
id: "0085"
title: "docker-buildx-cache-zap"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add docker/setup-buildx-action@v3 to zap-baseline job"
  - "Build web image with docker/build-push-action: load=true, cache-from/to=type=gha, tags=rekenreis-web:latest"
  - "Build api image idem, tags=rekenreis-api:latest"
  - "Replace 'docker compose up -d' with pre-build + 'docker compose up --no-build -d'"
  - "Cache key: hash of Dockerfile + package.json/pnpm-lock.yaml (web), Dockerfile + composer.lock (api)"
scope_out:
  - "Registry push"
  - "Compose file changes"
acceptance:
  - "zap-baseline job uses buildx cache"
  - "Second run reuses layers (faster build)"
  - "CI passes"
  - "Gates C, D, F pass"
lanes:
  - name: "I"
    files: [".github/workflows/gates.yml"]
gates: ["C", "D", "F"]
risks:
  - area: "ci"
    note: "Cache key must include lockfiles for integrity"
---

## Context

Epic: CI speed. Docker images in zap-baseline worden nu elke run opnieuw gebouwd. Buildx + GHA cache moet layer reuse mogelijk maken.
