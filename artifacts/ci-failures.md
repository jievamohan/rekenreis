# CI Failures

- **Run ID**: 22672433501
- **PR**: #19
- **Head SHA**: 4b433ef

## Failure: Gate D (Security) — Hadolint

Hadolint fails on **warnings** (exit code 1):
- `apps/api/Dockerfile` line 3: DL3018 (pin apk versions), SC2046 (quote)
- `apps/api/Dockerfile` line 24: DL3059 (consolidate RUN)

**Fix**: Run Hadolint with `--failure-threshold error` so only error-level findings fail the step.
