# Discovery — Epic 23: Playwright CI Speed

## Business Context

- **Intent:** Improve GitHub Actions Playwright CI run time. First do a benchmark, then fine-tune until under 1 minute.
- **Current state:** Playwright e2e job runs in ~2+ minutes (benchmark: ~2m 10s total including stack startup; Playwright reported "20 passed (2.0m)").
- **Target:** Total Playwright CI run time < 60 seconds.

## Stakeholder Needs

- **Developers:** Faster feedback on PRs; shorter CI cycles.
- **CI/CD:** Reduced runner minutes; cost efficiency.
- **Quality:** No regression in test coverage or reliability.

## Success Criteria

- Playwright job (e2e-container) completes in < 60 seconds.
- All existing tests remain green.
- No reduction in test coverage or reliability.
- Benchmark documented before/after.

## Non-Goals

- Changing test logic or assertions.
- Adding new tests.
- Migrating to another CI provider.
