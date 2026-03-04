---
id: "0039"
title: "smoke-mode-switch"
owner: "orchestrator"
status: "done"
scope_in:
  - "Update docs/runbooks smoke verification for mode switch"
  - "Add steps: /play?mode=timed-pop, timeout flow"
  - "Verify existing smoke steps still pass"
scope_out:
  - "Automated e2e scripts"
acceptance:
  - "docs/runbooks/commands.md (or smoke doc) includes mode switch steps"
  - "Manual smoke: classic, timed-pop, timed-pop timeout all pass"
  - "Existing smoke: /play, /play?mode=pack, /play?skin=X still documented and pass"
lanes:
  - name: "I"
    files: ["docs/**"]
gates: ["C", "D", "F"]
risks: []
deps: ["0037"]
---

## Context

Epic 6: extend smoke to cover mode switch. Smoke is manual per docs; ensure runbook is complete.
