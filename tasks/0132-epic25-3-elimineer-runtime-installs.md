---
id: "0132"
title: "epic25-3-elimineer-runtime-installs"
scope_in:
  - "scripts/ci/e2e-benchmark.sh"
  - "docs/runbooks/e2e-benchmark.md"
scope_out:
  - "apps/web"
  - "apps/api"
  - "test logic"
lanes: ["I"]
gates: ["C", "D", "F"]
risk_tags: ["infra"]
acceptance:
  - "Geen pnpm install in container bij cache hit"
  - "Install-stap significant korter"
  - "Alle tests green"
  - "Playwright runs container-only via docker compose e2e"
---

# Epic 25.3 — Elimineer Runtime Installs

## Goal

Verwijder npm install -g pnpm uit e2e run; gebruik custom image (Epic 25.2).

## Implementation

1. e2e-benchmark.sh: remove `npm install -g pnpm@9 &&` from both code paths
2. Custom e2e image (25.2) already has pnpm; use pnpm directly
3. Update docs/runbooks/e2e-benchmark.md with Epic 25.2–25.3 notes
