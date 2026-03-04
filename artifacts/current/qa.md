# QA: ZAP Workflow Speed

## Acceptance Criteria

1. ZAP job completes successfully on PR.
2. All 4 ZAP targets scanned: web /start, /play; api /api/health, /api/session-stats.
3. Security headers check still passes.
4. Gate C, D, F, Lint & Test unchanged.
5. On cache-hit run: ZAP job ≤120s (stretch ≤90s).
6. Reports still written to artifacts/current/zap/.

## Test Plan

1. Push to feature branch; verify CI green.
2. Trigger second run (cache warm); measure ZAP job duration in Actions UI.
3. Verify ZAP reports present in artifacts.
4. Confirm no regression in security coverage (same URLs, same rules).
