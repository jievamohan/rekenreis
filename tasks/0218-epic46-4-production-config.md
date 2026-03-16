---
id: 0218-epic46-4-production-config
title: Epic 46.4 — Production Config + Docs
scope_in:
  - NUXT_PUBLIC_API_URL for prod build (relative or full URL)
  - apps/api/.env.example: API_URL, APP_URL for prod
  - Runbook: full deployment flow, DirectAdmin public folder config
  - Gate C, D, F green
scope_out:
  - Feature work beyond config/docs
lanes: [I, W2]
file_globs:
  - apps/api/.env.example
  - .env.example
  - apps/web/nuxt.config.ts
  - scripts/build-for-prod.sh
  - docs/runbooks/*.md
gates: [C, D, F]
risk_tags: [infra]
acceptance:
  - Prod build uses correct API URL (same-origin or configured)
  - .env.example complete for prod
  - Runbook describes full deploy flow
status: pending
---

# Epic 46.4 — Production Config + Docs

Production config and documentation for deployment.
