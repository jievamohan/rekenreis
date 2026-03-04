---
id: "0029"
title: "error-states"
owner: "orchestrator"
status: "done"
scope_in:
  - "Improve error display when API unreachable (/start)"
  - "Play page resilient (game is client-only; no API dependency)"
  - "Friendly messages; no raw stack traces"
scope_out:
  - "Retry logic; complex offline mode"
acceptance:
  - "API down: user sees friendly message"
  - "Play loads and works without API"
lanes:
  - name: "W1"
    files: ["apps/web/pages/**"]
  - name: "W2"
    files: ["apps/web/composables/**", "apps/web/utils/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 5: reduce flakiness; improve error states.
