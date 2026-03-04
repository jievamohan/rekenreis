# Discovery: Artifact Lifecycle Hardening

## User Goal

Introduce a structured artifact lifecycle so that:
- All scripts read/write only `artifacts/current` (single source of truth during a feature run)
- Completed feature runs are archived to `artifacts/archive/<epic-id>/<timestamp>`
- PR bootstrap, task checklist sync, and ci-watch continue to work unchanged from the user's perspective

## Success Metrics

- Every script that touches artifacts uses `artifacts/current` exclusively
- Archive step runs after finalize, preserving a timestamped snapshot
- No regression in PR creation, task sync, or CI watch behavior

## Scope_in

- Introduce `artifacts/current` as the working directory for all artifact reads/writes
- Introduce `artifacts/archive/<epic-id>/<timestamp>` for completed runs
- Update scripts: `gh_pr_bootstrap.sh`, `gh_watch.sh`, `gh_fetch_logs.sh`, `gh_finalize_feature.sh`
- Update CI workflow (gates.yml) for ZAP and any artifact paths
- Add archive step after finalize (copy `artifacts/current` → `artifacts/archive/...`)
- Update `.cursor/commands`, `.cursor/rules`, subagents that reference `artifacts/` paths

## Scope_out

- Any game features
- Changing artifact content schema (plan.md, risk.md, etc.)
- Migrating historical artifacts
- Changing PR/CI semantics

## Functional Requirements

1. **Current workspace**: All artifact consumers write to and read from `artifacts/current/`
2. **Archive on finalize**: After `gh_finalize_feature.sh` succeeds (CI green), copy `artifacts/current` to `artifacts/archive/<epic-id>/<timestamp>`
3. **Epic-id resolution**: Derive from branch name (e.g. `feat/epic16-*` → `epic16`) or env `EPIC_ID`; fallback to branch slug
4. **Timestamp format**: ISO8601 compact, e.g. `20260304T182030Z`
5. **Backward compatibility**: Scripts must work when invoked from feature pipeline; no breaking changes to `/feature` or `/orchestrate-task` flows

## Acceptance Criteria (Given/When/Then)

- **AC1**: Given a feature run, when any script writes an artifact, then it writes to `artifacts/current/`
- **AC2**: Given a successful finalize, when archive runs, then `artifacts/archive/<epic-id>/<timestamp>/` contains a copy of `artifacts/current`
- **AC3**: Given PR bootstrap, when run, then PR is created and `artifacts/current/pr-number.txt`, `pr-url.txt` exist
- **AC4**: Given ci-watch, when run, then it reads/writes `artifacts/current/ci-status.md`, `ci-last-run-id.txt`
- **AC5**: Given CI workflow, when ZAP runs, then it uses `artifacts/current/zap/` (or equivalent)

## Edge Cases

- **Empty current**: First run: `artifacts/current` may not exist; scripts must `mkdir -p artifacts/current`
- **Archive idempotency**: Archive step should not fail if run twice with same timestamp (overwrite or skip)
- **Epic-id unknown**: Branch like `feat/foo-bar` → use `foo-bar` or `unknown` as epic-id

## Dependencies

- `gh`, `git` (existing)
- No new runtime dependencies

## Risk Tags

- **infra**: Script path changes; low risk if tested
- **deps**: None

## Assumptions

- Epic-id can be derived from branch name; no central epic registry required
- Archive is best-effort; failure to archive does not block finalize success
- `.gitignore` continues to exclude `artifacts/*.md` and `artifacts/zap/`; we add `artifacts/current/` and `artifacts/archive/` to ignore if desired (or keep current for local dev)
