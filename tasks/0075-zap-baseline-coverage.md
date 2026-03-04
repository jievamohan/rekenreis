---
id: "0075"
title: "zap-baseline-coverage"
owner: "orchestrator"
status: "done"
scope_in:
  - "Extend ZAP baseline to additional URLs beyond /start and /api/health"
  - "Web: add /play (or /play?mode=classic) to ZAP target"
  - "API: add /api/session-stats or equivalent to ZAP target"
  - "Update gates.yml zap-baseline job with new targets"
scope_out:
  - "ZAP active scanning"
  - "Full site crawl"
  - "Changes to app code (headers, routes)"
acceptance:
  - "ZAP baseline runs against web /start and /play (or equivalent)"
  - "ZAP baseline runs against api /api/health and at least one other API route"
  - "gates.yml reflects new targets"
  - "CI passes"
lanes:
  - name: "I"
    files: [".github/workflows/gates.yml"]
gates: ["C", "D", "F"]
risks: ["ci"]
---

## Context

Epic 14: Extend OWASP ZAP baseline coverage. Current coverage is minimal (web: /start, api: /api/health).

## Dependencies

- Requires running stack (docker compose). No app changes.
