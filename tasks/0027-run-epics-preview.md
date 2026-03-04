---
id: "0027"
title: "run-epics-preview"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add PREVIEW step to .cursor/commands/run-epics.md"
  - "Before execution: read epics, show done/pending, indicate next"
  - "Output format: Epic N (done/pending) -> next: Epic M"
scope_out:
  - "Blocking; preview is informational only"
acceptance:
  - "Protocol includes PREVIEW step"
  - "Clear output of what will run"
lanes:
  - name: "I"
    files: [".cursor/commands/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Visibility: see what /run-epics will execute before it runs.
