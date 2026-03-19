---
id: 0220-epic51-1-remember-login
title: Remember login by default
scope_in:
  - AuthController: login with remember=true, register with remember=true
  - API tests: verify remember token/cookie
  - E2E: simulate persisted session
scope_out:
  - UI checkbox for remember (geen checkbox)
  - Change session lifetime config
lanes: [A1, A2, T]
file_globs:
  - apps/api/app/Http/Controllers/AuthController.php
  - apps/api/tests/Feature/AuthTest.php
  - apps/web/e2e/auth-helper.ts
  - apps/web/e2e/*.spec.ts
gates: [C, D, F]
risk_tags: [auth]
acceptance:
  - Auth::attempt($credentials, true) in login
  - Auth::login($user, true) in register when hasSession
  - API test verifies remember cookie or token set
  - E2E simulates persisted session (restore storage, /map accessible)
  - Gate C, D, F green
---

# Epic 51.1 — Remember login by default
