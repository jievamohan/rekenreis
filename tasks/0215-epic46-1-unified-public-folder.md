---
id: 0215-epic46-1-unified-public-folder
title: Epic 46.1 — Unified Public Folder + Routing
scope_in:
  - Build script: Vue (nuxt generate) output kopiëren naar apps/api/public
  - Merge-strategie: behoud index.php en .htaccess; Vue levert index.html, _nuxt/
  - .htaccess: /api/* → index.php; overige niet-bestaande paden → index.html (SPA fallback)
  - Dev: Docker setup ongewijzigd (web 3000, api 8001)
  - Gate C, D, F green
scope_out:
  - Pre-push hook (Epic 46.2)
  - Makefile deploy targets (Epic 46.3)
  - Prod config (Epic 46.4)
lanes: [I]
file_globs:
  - Makefile
  - scripts/**/*.sh
  - apps/api/public/.htaccess
  - apps/web/package.json
gates: [C, D, F]
risk_tags: [infra]
acceptance:
  - make build of equivalent produceert unified folder
  - Lokaal php -S localhost:8000 -t apps/api/public serveert / en /api/health correct
  - Geen regressie in dev
status: done
---

# Epic 46.1 — Unified Public Folder + Routing

Build Epic 46.1: Unified public folder zodat Laravel API en Vue frontend samen uit apps/api/public worden geserveerd.
