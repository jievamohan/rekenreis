# QA Strategy — Epic 23: Playwright CI Speed

## Test Strategy

### Regression Prevention

- **Invariant:** All existing Playwright tests must remain green after each optimization.
- **No test logic changes** unless deduplication explicitly removes redundant coverage.

### Benchmark Validation

- Add CI step or script to record e2e-container job duration.
- Document baseline in artifacts/current or docs/runbooks.
- Target: job duration < 60s.

### Acceptance Criteria per Slice

- **23.1:** Benchmark script runs; baseline documented.
- **23.2:** Workers/project changes; all tests pass; duration reduced.
- **23.3:** pnpm cache/slow-test optimizations; all tests pass; duration reduced.
- **23.4:** Final fine-tuning; job < 60s; all tests pass.

### Non-Flaky Assertions

- Optimizations must not introduce flakiness.
- If workers > 1: verify no shared state between tests (e.g. localStorage, session).
- Retries (1) remain acceptable for transient failures.
