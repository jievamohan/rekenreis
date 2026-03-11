---
id: 0213-epic45-1-progress-controller
title: Progress CRUD controller and routes
scope_in:
  - ProgressController: index (GET), update (PUT)
  - GET /api/progress, PUT /api/progress (auth:sanctum)
  - user_id-scoped progress
scope_out: []
lanes: [A1, A2]
file_globs: [apps/api/app/Http/Controllers/**]
gates: [C, D]
risk_tags: [auth]
acceptance:
  - Progress CRUD works for authenticated user
  - No cross-user access
  - PHPStan clean
---

# Epic 45.1 — Progress controller
