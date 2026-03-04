---
id: "0033"
title: "hardening-trivy-hadolint-zap"
owner: "orchestrator"
status: "done"
scope_in:
  - "Hadolint in CI for apps/web and apps/api Dockerfiles"
  - "Trivy config scan in CI"
  - "OWASP ZAP baseline job against docker-compose stack (web + api)"
scope_out:
  - "Trivy image scan (optional; can add later)"
  - "ZAP active scanning"
acceptance:
  - "Hadolint step in CI; Dockerfiles pass"
  - "Trivy config scan runs; report or exit clean"
  - "ZAP baseline job: compose up, wait for health, zap-baseline.py against web and api"
lanes:
  - name: "I"
    files: [".github/**", "scripts/ci/**", "docs/runbooks/**"]
gates: ["C", "D", "F"]
risks: ["ci"]
---

## Context

Hardening Epic: Trivy, Hadolint, OWASP ZAP baseline.
