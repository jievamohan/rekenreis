# UX: Artifact Lifecycle Hardening

## Context

This is an infrastructure/pipeline feature. No end-user UI changes.

## Operator Experience

- **Developers/agents**: Continue to run `/feature`, `scripts/ci/gh_pr_bootstrap.sh`, `scripts/ci/gh_watch.sh` without changing invocation
- **Transparency**: Archive provides audit trail; operators can inspect `artifacts/archive/<epic-id>/<timestamp>/` for past runs
- **No new commands**: Archive runs automatically after finalize; no manual step

## Accessibility / A11y

N/A (no UI).
