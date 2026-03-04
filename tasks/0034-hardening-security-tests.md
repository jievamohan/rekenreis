---
id: "0034"
title: "hardening-security-tests"
owner: "orchestrator"
status: "done"
scope_in:
  - "Security regression tests: headers, cookies, CORS, API validation/authz defaults"
  - "Minimal Nuxt headers config if needed for tests"
  - "Minimal Laravel CORS config if needed for tests"
scope_out:
  - "Auth implementation"
  - "Full pentest"
acceptance:
  - "Web: test for security headers (e.g. X-Frame-Options)"
  - "API: CORS and validation tests (e.g. session-stats invalid payload → 422)"
  - "All gates PASS"
lanes:
  - name: "T"
    files: ["apps/web/**/*.test.ts", "apps/api/tests/**"]
  - name: "W2"
    files: ["apps/web/nuxt.config.ts"]
  - name: "A2"
    files: ["apps/api/config/**", "apps/api/app/Http/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Hardening Epic: minimal security regression tests.
