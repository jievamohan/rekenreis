---
id: 0212-epic45-1-auth-controllers
title: Auth controllers and routes
scope_in:
  - AuthController: login, register, forgotPassword, resetPassword
  - POST /api/login, /api/register, /api/forgot-password, /api/reset-password
  - GET /api/user (auth:sanctum)
scope_out: []
lanes: [A1, A2]
file_globs: [apps/api/app/Http/Controllers/**]
gates: [C, D]
risk_tags: [auth]
acceptance:
  - Login, register, forgot, reset work via API
  - GET /api/user returns authenticated user
  - PHPStan clean
---

# Epic 45.1 — Auth controllers
