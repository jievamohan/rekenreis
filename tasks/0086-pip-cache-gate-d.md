---
id: "0086"
title: "pip-cache-gate-d"
owner: "orchestrator"
status: "done"
scope_in:
  - "Add actions/cache for pip in gate-d-security job"
  - "Cache path: ~/.cache/pip or pip cache dir"
  - "Key: pip-${{ hashFiles('.github/workflows/gates.yml') }}-semgrep"
  - "Restore before 'pip install semgrep'"
scope_out:
  - "Other pip packages"
acceptance:
  - "Semgrep step uses pip cache"
  - "CI passes"
  - "Gates C, D, F pass"
lanes:
  - name: "I"
    files: [".github/workflows/gates.yml"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic: CI speed. Pip install semgrep draait elke run. Cache moet installatie versnellen.
