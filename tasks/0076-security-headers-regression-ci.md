---
id: "0076"
title: "security-headers-regression-ci"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add CI script or job step that asserts security headers (X-Frame-Options, X-Content-Type-Options) on web and api"
  - "Add CORS regression check (e.g. OPTIONS preflight, Access-Control-Allow-Origin) for api"
  - "Script runs against running stack (e.g. during or after ZAP job, or in dedicated step)"
  - "Fail CI if required headers/cookies/CORS are missing"
scope_out:
  - "Unit tests in apps/web or apps/api (Lane T)"
  - "Changes to nuxt.config or Laravel config (Lanes W2, A2)"
  - "Full pentest"
acceptance:
  - "scripts/ci/security-headers-check.sh (or equivalent) exists"
  - "Script asserts X-Frame-Options, X-Content-Type-Options on web responses"
  - "Script asserts CORS headers on api /api/health (or equivalent)"
  - "CI job runs script and fails on regression"
  - "Gates C, D, F pass"
lanes:
  - name: "I"
    files: [".github/workflows/gates.yml", "scripts/ci/**"]
gates: ["C", "D", "F"]
risks: ["ci"]
---

## Context

Epic 14: Add regression tests for security headers/cookies/CORS. ZAP uses || true and does not fail. Need deterministic curl-based checks.

## Dependencies

- Requires stack running (e.g. ZAP job or dedicated job). May run in zap-baseline job after health check.
