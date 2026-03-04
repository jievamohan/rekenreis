---
id: "0072"
title: "useProgressSummary-composable"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create useProgressSummary(profile?) composable"
  - "Computed: roundsToday, roundsTotal, accuracy (0-100), favoriteMode"
  - "copyToClipboard(): sanitized JSON, no id/name; navigator.clipboard.writeText"
  - "downloadJson(): Blob + anchor download; filename rekenreis-progress-YYYY-MM-DD.json"
  - "Export payload: roundsToday, roundsTotal, accuracy, favoriteMode, exportedAt only"
scope_out:
  - "Summary page (0073)"
acceptance:
  - "Summary values derived correctly from profile"
  - "copyToClipboard returns success; payload has no identifiers"
  - "downloadJson triggers download"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/composables/useProgressSummary.ts"]
gates: ["C", "D", "F"]
risks:
  - "privacy: identifier leak in export — sanitize payload; test asserts no id/name"
---

## Context

Epic 13 Task 3. Composable for progress summary aggregation and local export (copy/download).
