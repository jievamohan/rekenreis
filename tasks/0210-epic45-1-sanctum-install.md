---
id: 0210-epic45-1-sanctum-install
title: Install Sanctum and configure for SPA
scope_in:
  - composer require laravel/sanctum
  - Publish Sanctum config
  - Configure stateful domains for SPA
  - Add HasApiTokens to User model
scope_out: []
lanes: [A2]
file_globs: [apps/api/**]
gates: [C, D]
risk_tags: [auth]
acceptance:
  - Sanctum installed and configured
  - User model has HasApiTokens
  - config/sanctum.php stateful domains include frontend origin
---

# Epic 45.1 — Install Sanctum
