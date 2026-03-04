---
id: "0079"
title: "docs-runbooks-epic14"
owner: "orchestrator"
status: "done"
scope_in:
  - "Update docs/runbooks/commands.md for Epic 14 changes"
  - "Document extended ZAP baseline coverage (URLs scanned)"
  - "Document composer cache in CI (if applicable)"
  - "Document security-headers-check script and how to run locally"
  - "Ensure smoke verification steps remain accurate"
scope_out:
  - "Full documentation overhaul"
  - "New runbook files beyond commands.md"
acceptance:
  - "docs/runbooks/commands.md reflects ZAP targets (web: /start, /play; api: /api/health, etc.)"
  - "Gate D section mentions security-headers-check if added"
  - "Smoke verification steps unchanged or updated if needed"
  - "Gates C, D, F pass"
lanes:
  - name: "I"
    files: ["docs/runbooks/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 14: docs/runbooks update. Ensure runbooks reflect new ZAP coverage, cache behavior, and security regression tooling.

## Dependencies

- Depends on tasks 0075, 0076, 0077 (to document their outputs). Can be done in parallel with placeholder text, then updated.
