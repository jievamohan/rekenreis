# Backlog: ZAP Workflow Speed

## Epic Summary

Reduce OWASP ZAP Baseline job from ~6 min to ≤90s (ideally ≤60s) via parallelization, caching, and tighter waits.

## Scope In

- Parallel Docker builds (buildx bake for web+api)
- Parallel ZAP scans (4 runs in parallel)
- Cache hardening (restore-keys for mysql/zap)
- Tighter health wait (12×2s instead of 36×5s)
- Optional: ZAP -m 1 for faster spider
- Optional: Artifactory if available (user to confirm)

## Scope Out

- Reducing ZAP URL coverage
- Changing ZAP rules or thresholds
- Moving ZAP to different trigger (e.g. merge-only)
- Modifying other gates (C, D, F, Lint)

## Risks + Mitigations

| Tag | Risk | Mitigation |
|-----|------|------------|
| infra | Cache key changes may cause cold run | Document; accept first run slower |
| perf | Parallel ZAP may stress stack | Monitor; revert if flaky |
| security | -m 1 reduces spider depth | Only if explicitly approved |

## NFRs

- **Perf:** ZAP job ≤120s warm, ≤90s stretch
- **Security:** Same coverage, no regression
- **Reliability:** No new flakiness

## Task List

| ID | Title | Lanes | Gates | Risk |
|----|-------|-------|-------|------|
| 0091 | zap-workflow-parallel-build | I | C,D,F | infra |
| 0092 | zap-workflow-parallel-zap-cache | I | C,D,F | infra,perf |
| 0093 | zap-workflow-docs | I | - | - |
