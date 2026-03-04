---
id: "0030"
title: "perf-deps"
owner: "orchestrator"
status: "done"
scope_in:
  - "Verify bundle size within budget"
  - "Remove unnecessary deps if any"
  - "pnpm audit; document baseline"
scope_out:
  - "Major bundle changes"
acceptance:
  - "Build succeeds; size within budget"
  - "No unused heavy deps"
lanes:
  - name: "I"
    files: ["apps/web/package.json", "artifacts/perf.md"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Verify no regression"
---

## Context

Epic 5: perf within budgets.
