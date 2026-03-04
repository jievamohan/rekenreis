---
id: "0083"
title: "bug-bash-checklist"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create test checklist doc (manual verification steps for release)"
  - "Quick scripts: start stack, open key URLs in browser"
  - "Checklist covers: play flows, stickers, summary, settings, profiles, modes, skins"
scope_out:
  - "Automated E2E expansion"
  - "CI integration of checklist"
acceptance:
  - "docs/bug-bash-checklist.md exists with structured manual steps"
  - "scripts/bug-bash/ (or equivalent) contains start script and open-urls script"
  - "Checklist maps to smoke + release-critical paths"
  - "Gates C, D, F pass"
lanes:
  - name: "I"
    files: ["docs/**", "scripts/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 15: Release Prep. Bug bash automation: structured checklist + quick scripts for manual verification.

## Dependencies

None.
