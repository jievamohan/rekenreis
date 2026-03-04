---
id: "0023"
title: "privacy-optout"
owner: "orchestrator"
status: "done"
scope_in:
  - "useTelemetry composable: telemetryOptOut preference (localStorage)"
  - "Privacy note (short text about data)"
  - "Opt-out switch in UI (play page or footer)"
  - "Only call session-stats when opt-out is false"
scope_out:
  - "Complex consent flows"
acceptance:
  - "Opt-out switch visible and functional"
  - "When opted out, no telemetry call"
  - "Privacy note displayed"
lanes:
  - name: "W1"
    files: ["apps/web/pages/**", "apps/web/components/**"]
  - name: "W2"
    files: ["apps/web/composables/**"]
gates: ["C", "D", "F"]
risks:
  - area: "privacy"
    note: "Default: opt-out for privacy-first"
---

## Context

Epic 4: Privacy notes and opt-out.
