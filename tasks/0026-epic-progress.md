---
id: "0026"
title: "epic-progress"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create docs/epic-progress.md"
  - "Structure: epic id, status (done/pending), optional note"
  - "Seed with Epic 2–4 done, Epic 5 pending"
scope_out:
  - "Automated sync with GitHub"
acceptance:
  - "docs/epic-progress.md exists"
  - "Readable status for each epic"
lanes:
  - name: "I"
    files: ["docs/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Progress file for run-epics visibility.
