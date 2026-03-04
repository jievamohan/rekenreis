---
id: "0087"
title: "docs-runbooks-ci-cache"
owner: "orchestrator"
status: "done"
scope_in:
  - "Update docs/runbooks/commands.md (of nieuw bestand) met CI cache-strategie"
  - "Document: Docker buildx cache (zap-baseline), pip cache (gate-d), pnpm/composer cache"
scope_out:
  - "Volledige CI documentatie"
acceptance:
  - "Cache-strategie gedocumenteerd"
  - "Gates C, D, F pass"
lanes:
  - name: "I"
    files: ["docs/runbooks/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic: CI speed. Documenteer de cache-optimalisaties voor toekomstige wijzigingen.
