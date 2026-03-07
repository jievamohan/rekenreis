---
id: "0001"
title: "e2e-step-timing"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add step timing to e2e-container job (Build images, Start stack, Run Playwright)"
  - "Output duration per step to CI job summary (GITHUB_STEP_SUMMARY)"
  - "Update docs/runbooks/e2e-benchmark.md with baseline section (spinup vs test-runtime)"
scope_out:
  - "MySQL cache (Epic 24.2)"
  - "Build cache fix (Epic 24.3)"
acceptance:
  - "e2e-container job outputs duration per step in job summary"
  - "docs/runbooks/e2e-benchmark.md documents baseline (build, start, e2e)"
  - "All Playwright tests remain green"
  - "Playwright runs container-only via docker compose e2e"
lanes:
  - name: "I"
    files: [".github/workflows/gates.yml", "scripts/ci/e2e-benchmark.sh", "docs/runbooks/e2e-benchmark.md"]
gates: ["C", "D", "F"]
risks:
  - tag: "infra"
    note: "Workflow changes; low risk"
---

## Context

Epic 24.1: Meet duur per CI-stap en documenteer baseline voor spinup-optimalisatie.
