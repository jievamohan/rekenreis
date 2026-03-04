# QA: Artifact Lifecycle Hardening

## Test Strategy

### Unit / Script Tests

- **Path resolution**: Verify scripts resolve `artifacts/current` correctly
- **Archive**: Run `gh_archive_artifacts.sh` and assert `artifacts/archive/<epic-id>/<timestamp>/` exists with expected files

### Integration Tests

- Run `gh_pr_bootstrap.sh` (requires gh auth, PR creation) → verify `artifacts/current/pr-number.txt` exists
- Run `gh_watch.sh` with mock/short timeout → verify `artifacts/current/ci-status.md` written
- Run `gh_fetch_logs.sh` with a known RUN_ID → verify logs in `artifacts/current/ci-logs/`

### Smoke / E2E

- Execute a minimal `/feature` run (e.g. --plan only) and confirm:
  - PR bootstrap creates PR and writes to `artifacts/current`
  - Finalize + archive produces `artifacts/archive/...`

### Acceptance Criteria Mapping

| AC | Test |
|----|------|
| AC1 | Grep all scripts for `artifacts/` and assert they use `artifacts/current` |
| AC2 | Run archive after finalize; assert archive dir exists and contains copy |
| AC3 | Run PR bootstrap; assert pr-number.txt in artifacts/current |
| AC4 | Run ci-watch; assert ci-status.md in artifacts/current |
| AC5 | CI workflow run; assert ZAP uses artifacts/current/zap |
