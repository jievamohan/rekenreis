---
id: "0022"
title: "api-session-stats"
owner: "orchestrator"
status: "done"
scope_in:
  - "POST /api/session-stats endpoint (anonymous, no auth)"
  - "Body: { score?, rounds? } - optional fields"
  - "Log only (no DB); minimal storage"
scope_out:
  - "Auth; PII; DB storage; complex analytics"
acceptance:
  - "Endpoint accepts POST with JSON body"
  - "No auth required"
  - "PHPStan passes"
lanes:
  - name: "A1"
    files: ["apps/api/routes/**", "apps/api/app/Http/Controllers/**"]
  - name: "A2"
    files: ["apps/api/app/**"]
gates: ["C", "D", "F"]
risks:
  - area: "privacy"
    note: "Anonymous only; document in risk.md"
---

## Context

Epic 4: Optional API telemetry.
