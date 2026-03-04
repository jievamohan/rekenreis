---
id: "0078"
title: "zap-job-reliability"
owner: "orchestrator"
status: "done"
scope_in:
  - "Reduce flakiness in zap-baseline job"
  - "Improve health wait: reduce fixed sleeps, use exponential backoff or smarter retry"
  - "Consider ZAP step retry on transient failure"
  - "Tune timeouts if needed (e.g. -m 2 for ZAP)"
scope_out:
  - "Removing ZAP job"
  - "Adding playwright/cypress"
  - "Changes to docker-compose startup"
acceptance:
  - "Health wait is more robust (e.g. curl loop with shorter initial delay, or backoff)"
  - "ZAP job completes reliably; fewer spurious failures"
  - "CI passes"
  - "Gates C, D, F pass"
lanes:
  - name: "I"
    files: [".github/workflows/gates.yml"]
gates: ["C", "D", "F"]
risks: ["ci"]
---

## Context

Epic 14: Reduce flaky e2e further. ZAP job is the closest automated e2e. Current: sleep 8, sleep 15, 36×5s health loop. Stack startup can be slow on cold runners.

## Dependencies

- None. Pure CI change.
