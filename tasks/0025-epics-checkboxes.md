---
id: "0025"
title: "epics-checkboxes"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add - [ ] / - [x] checkbox before each epic heading in docs/epics.md"
  - "Epic 2, 3, 4: [x] (done); Epic 5: [ ] (pending)"
scope_out:
  - "Automated updates"
acceptance:
  - "Each epic has a checkbox"
  - "Epics 2–4 marked done; Epic 5 pending"
lanes:
  - name: "I"
    files: ["docs/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Improve epic visibility: checkboxes for status tracking.
