# Infra Review — Epic 23.1

## Changes

- **scripts/ci/e2e-benchmark.sh:** New script wrapping Playwright run with timing; writes duration to artifacts/ci/e2e-duration-seconds.txt and GITHUB_STEP_SUMMARY.
- **.github/workflows/gates.yml:** Replace inline docker compose run with `bash scripts/ci/e2e-benchmark.sh`; add artifact upload for e2e-benchmark.
- **docs/runbooks/e2e-benchmark.md:** New runbook documenting baseline and optimization roadmap.
- **docs/runbooks/commands.md:** Link to e2e-benchmark.md.
- **.gitignore:** Add artifacts/ci/.

## Risk Assessment

- **Low:** No change to test logic or execution path; only adds timing wrapper.
- **Integrity:** Script preserves exit code from Playwright run; failures still fail the job.
- **Gate D:** No new secrets or external dependencies.

## Verdict

PASS. Safe to merge.
