# Backlog — Epic 23: Playwright CI Speed

## Micro-Epics (slices)

| Slice | Title | Tasks (≤5) | Milestone |
|-------|-------|------------|-----------|
| 23.1 | Benchmark & Baseline | 1. Add benchmark script/timing 2. Document baseline in runbook 3. CI job outputs duration | Baseline documented |
| 23.2 | Workers & Project Consolidation | 1. Increase workers to 2–4 2. Restrict visual project to visual specs only 3. Verify all tests pass | Duration ~50% reduced |
| 23.3 | pnpm Cache & Slow Test Optimization | 1. Cache pnpm in e2e path 2. Optimize mistakes-review.spec 3. Reduce redundant waits | Additional 15–25s saved |
| 23.4 | Fine-Tune to <60s | 1. Deduplicate overlapping tests if needed 2. Final tuning 3. Document final config | Job < 60s |

## Out of Scope

- Migrating to GitLab or other CI.
- Changing test assertions or coverage goals.
- Adding new tests.
