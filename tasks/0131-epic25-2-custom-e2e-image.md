---
id: "0131"
title: "epic25-2-custom-e2e-image"
scope_in:
  - "docker/e2e/Dockerfile"
  - "docker-bake.hcl"
  - ".github/workflows/gates.yml"
  - "docker-compose.ci.yml"
scope_out:
  - "apps/web"
  - "apps/api"
  - "test logic"
lanes: ["I"]
gates: ["C", "D", "F"]
risk_tags: ["infra"]
acceptance:
  - "e2e image gebouwd en gecached"
  - "Cache hit bij lockfile ongewijzigd"
  - "Alle tests green"
  - "Playwright runs container-only via docker compose e2e"
---

# Epic 25.2 — Custom e2e Image met pnpm

## Goal

Custom e2e image met pnpm pre-installed en GHA cache.

## Implementation

1. Create docker/e2e/Dockerfile: FROM playwright + RUN pnpm install -g pnpm@9
2. Add e2e target to docker-bake.hcl
3. Add e2e to Build images step with GHA cache (scope=e2e)
4. docker-compose.ci.yml: override e2e service to use rekenreis-e2e:latest
5. Remove redundant Playwright image cache (e2e image is built, not pulled)
