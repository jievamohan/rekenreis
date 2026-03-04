---
id: "0032"
title: "hardening-policy-gitleaks-semgrep"
owner: "orchestrator"
status: "done"
scope_in:
  - "Policy-as-code checks for compose/workflows/env files"
  - "Gitleaks config (.gitleaks.toml) tuned for config-file secrets patterns"
  - "Semgrep custom rules for TS + PHP + YAML; wire semgrep in CI"
scope_out:
  - "Changing application code (logic, UI)"
  - "Auth implementation"
acceptance:
  - "Policy check script/job fails on violations (hardcoded secrets in compose/workflows/env)"
  - ".gitleaks.toml exists, extends default, allows known placeholders, CI uses it"
  - "Semgrep custom rules in .semgrep/; semgrep runs in Gate D; clean or documented"
lanes:
  - name: "I"
    files: [".github/**", ".gitleaks.toml", ".semgrep/**", "scripts/ci/**", "docs/runbooks/**"]
gates: ["C", "D", "F"]
risks: ["config"]
---

## Context

Hardening Epic: policy-as-code, gitleaks tuning, semgrep custom rules.
