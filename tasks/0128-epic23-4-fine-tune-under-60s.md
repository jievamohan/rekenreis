---
id: "0128"
title: "epic23-4-fine-tune-under-60s"
owner: "orchestrator"
status: "pending"
scope_in:
  - "If still >60s: deduplicate overlapping tests"
  - "Apply remaining optimizations (workers, timeout tweaks)"
  - "Document final config in docs/runbooks"
  - "e2e-container job duration < 60 seconds"
scope_out:
  - "Changing test assertions or coverage"
acceptance:
  - "e2e-container job completes in < 60 seconds"
  - "All tests green"
  - "Final config documented"
lanes:
  - name: "I"
    files: ["apps/web/playwright.config.ts", "docs/runbooks/**"]
gates: ["C", "D", "F"]
risks:
  - area: "infra"
    note: "Workers 4 may expose flakiness"
---

## Context

Epic 23.4: Fine-tune to <60s per docs/design/epic-23.md.
