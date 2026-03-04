---
id: "0090"
title: "artifacts-current-and-scripts"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create artifacts/current directory structure"
  - "Update scripts/ci/gh_pr_bootstrap.sh, gh_watch.sh, gh_fetch_logs.sh to read/write artifacts/current"
  - "Update .github/workflows/gates.yml: artifacts/zap → artifacts/current/zap"
  - "Update .cursor/commands (orchestrate-task, feature, ci-watch, ci-fetch-logs, finalize-feature, verify-gates)"
  - "Update .cursor/rules (00-agentic-core, 05-branch-discipline, 30-lane-ownership, 40-security-policy, 50-ci-watch, 60-feature-pipeline)"
  - "Update .cursor/subagents that reference artifacts/ paths"
scope_out:
  - "Archive logic (Task 0091)"
  - "Game features"
acceptance:
  - "All scripts use artifacts/current for artifact reads/writes"
  - "PR bootstrap creates artifacts/current/pr-number.txt, pr-url.txt, pr.md"
  - "ci-watch writes artifacts/current/ci-status.md, artifacts/current/ci-last-run-id.txt"
  - "gh_fetch_logs writes to artifacts/current/ci-logs, artifacts/current/ci-failures.md"
  - "CI workflow uses artifacts/current/zap for ZAP reports"
  - "Grep audit: no remaining hardcoded artifacts/ (except artifacts/current, artifacts/archive)"
  - "Smoke: run gh_pr_bootstrap and verify artifacts/current/ populated"
lanes:
  - name: "I"
    files: ["scripts/ci/**", ".github/workflows/**", ".cursor/commands/**", ".cursor/rules/**", ".cursor/subagents/**"]
gates: ["C", "D", "F"]
risks:
  - tag: "infra"
    note: "Path changes; low risk if tested"
---

## Context

Part of artifact lifecycle hardening. This task introduces artifacts/current and migrates all consumers.

## Dependencies

None.
