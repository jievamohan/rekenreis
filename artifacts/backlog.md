# Backlog: Artifact Lifecycle Hardening

## Epic Summary

Introduce `artifacts/current` and `artifacts/archive/<epic-id>/<timestamp>`; update all scripts to read/write only `artifacts/current`; add archive step after finalize. Keep PR bootstrap, task checklist sync, ci-watch working.

## Scope_in

- artifacts/current as working directory
- artifacts/archive/<epic-id>/<timestamp> for completed runs
- Script updates: gh_pr_bootstrap, gh_watch, gh_fetch_logs, gh_finalize_feature
- CI workflow (gates.yml) for ZAP paths
- .cursor/commands, .cursor/rules, .cursor/subagents path references
- Archive script + finalize integration

## Scope_out

- Game features
- Schema changes to artifact content
- Historical migration

## Risks + Mitigations

| Risk | Tag | Mitigation |
|------|-----|------------|
| Path drift (missed script) | infra | Grep audit of artifacts/ references |
| Archive failure blocks finalize | infra | Archive best-effort; log and continue |

## NFRs

- Perf: No impact (file ops only)
- Security: No new surface
- Reliability: Scripts must handle missing artifacts/current (mkdir -p)

## Task List

| # | Task | Lanes | Gates | Risk |
|---|------|-------|-------|------|
| 1 | artifacts-current-and-scripts | I | C,D,F | infra |
| 2 | archive-and-finalize | I | C,D,F | infra |

---

## Task 1: artifacts-current-and-scripts

**Title**: Introduce artifacts/current and update all scripts to use it

**Scope_in**:
- Create artifacts/current directory structure
- Update scripts/ci/gh_pr_bootstrap.sh, gh_watch.sh, gh_fetch_logs.sh to read/write artifacts/current
- Update .github/workflows/gates.yml: artifacts/zap → artifacts/current/zap
- Update .cursor/commands (orchestrate-task, feature, ci-watch, ci-fetch-logs, finalize-feature, verify-gates)
- Update .cursor/rules (00-agentic-core, 05-branch-discipline, 30-lane-ownership, 40-security-policy, 50-ci-watch, 60-feature-pipeline)
- Update .cursor/subagents (orchestrator, reviewer, tester, security, performance, deps-infra, implementer-web, db)

**Acceptance**:
- All scripts use artifacts/current for reads/writes
- PR bootstrap creates artifacts/current/pr-number.txt, pr-url.txt
- ci-watch writes artifacts/current/ci-status.md
- CI workflow uses artifacts/current/zap
- Unit/smoke: run gh_pr_bootstrap (or dry-run) and verify paths

**Lanes**: I (scripts, .github, .cursor)

---

## Task 2: archive-and-finalize

**Title**: Add archive step and integrate into finalize

**Scope_in**:
- Create scripts/ci/gh_archive_artifacts.sh (copy artifacts/current → artifacts/archive/<epic-id>/<timestamp>)
- Integrate archive into gh_finalize_feature.sh (after CI watch succeeds)
- Update .gitignore for artifacts/archive if needed

**Acceptance**:
- gh_archive_artifacts.sh derives epic-id from branch, creates timestamped archive
- gh_finalize_feature.sh calls archive after CI green
- Archive dir contains copy of artifacts/current
- Test: run finalize on a branch and verify artifacts/archive/<epic-id>/<ts> exists

**Lanes**: I
