---
id: 0211-epic45-1-user-progress-migration
title: user_progress migration
scope_in:
  - Migration: user_progress (user_id, progress JSON)
  - UserProgress model
  - Ensure User.name exists for kindnaam
scope_out: []
lanes: [D]
file_globs: [apps/api/database/migrations/**]
gates: [C, D]
risk_tags: [db]
acceptance:
  - user_progress table exists
  - UserProgress model with user_id, progress
  - Migration reversible
---

# Epic 45.1 — user_progress migration
