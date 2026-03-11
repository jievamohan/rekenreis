---
id: 0214-epic45-1-tests-phpstan
title: Tests and PHPStan
scope_in:
  - Unit tests for AuthController, ProgressController
  - PHPStan clean
  - composer audit clean
scope_out: []
lanes: [T]
file_globs: [apps/api/tests/**]
gates: [C, D]
risk_tags: []
acceptance:
  - Auth and progress tests pass
  - PHPStan clean
  - composer audit clean
---

# Epic 45.1 — Tests and PHPStan
