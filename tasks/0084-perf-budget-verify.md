---
id: "0084"
title: "perf-budget-verify"
owner: "orchestrator"
status: "done"
scope_in:
  - "Verify web bundle size within baseline (artifacts/perf.md)"
  - "Document budget in perf.md if not explicit"
  - "Optimize if over budget (lazy-load, tree-shake, etc.)"
  - "Ensure CI size step remains accurate"
scope_out:
  - "Major bundle restructuring"
  - "New perf tooling"
acceptance:
  - "Build succeeds; bundle within documented budget"
  - "artifacts/perf.md has clear baseline (e.g. .output size, client chunk)"
  - "No unnecessary deps; no regression"
  - "Gates C, D, F pass"
lanes:
  - name: "I"
    files: ["apps/web/package.json", "artifacts/perf.md", ".github/workflows/**"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Optimization could regress; measure before/after"
---

## Context

Epic 15: Release Prep. Performance: verify budgets and optimize if needed.

## Dependencies

None.
