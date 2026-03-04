---
id: "0031"
title: "docs-runbooks"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add quick start to README or docs"
  - "Update docs/runbooks/commands.md if needed"
  - "Smoke steps current for play, skins"
scope_out:
  - "Full documentation overhaul"
acceptance:
  - "Quick start exists (clone, install, run)"
  - "Runbooks reflect current behavior"
lanes:
  - name: "I"
    files: ["docs/**", "README.md"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 5: docs quick start + runbooks.
