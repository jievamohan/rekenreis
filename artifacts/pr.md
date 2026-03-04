# ZAP Workflow Speed

Reduce OWASP ZAP Baseline job from ~6 min to ≤90s via parallelization, caching, and tighter waits.

**Scope:**
- Parallel Docker builds (buildx bake)
- Parallel ZAP scans (4 runs)
- Cache hardening (restore-keys)
- Tighter health wait

## Tasks

- [ ] 0091-zap-workflow-speed

## PR Metadata
- Base: main
- Branch: feat/zap-workflow-speed
- PR: #37
- URL: https://github.com/jievamohan/rekenreis/pull/37
