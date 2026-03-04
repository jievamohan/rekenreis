# Epic 13 — Share/Print Progress Summary: Backlog

## Epic Summary

Parent-friendly, local-only progress summary: rounds played, accuracy trend, favorite mode. Optional export via copy-to-clipboard or download JSON. No identifiers; no cloud sync.

## Scope In

- Profile progress: extend with totalRounds, totalCorrect, totalWrong, totalTimeout, modeCounts
- useRoundOutcome: record per-round outcome + mode when round completes
- useProgressSummary: aggregate summary, copyToClipboard, downloadJson
- Summary page: /summary with metrics, export buttons
- Play integration: call recordRoundOutcome in onNext
- Nav link to /summary
- Tests: summary aggregation correctness, useRoundOutcome, useProgressSummary

## Scope Out

- Cloud sync
- Analytics dashboards
- Social sharing (Twitter, etc.)
- Unbounded session history (use aggregates only)

## Risks + Mitigations

| Tag | Risk | Mitigation |
|-----|------|------------|
| privacy | Identifier leak in export | Sanitize payload; test asserts no id/name |
| perf | Bundle growth | No new heavy deps; native clipboard/Blob |

## NFRs

- Gates: C (typecheck), D (security), F (bundle budget)
- Lanes: W1, W2, T only

## Task List

| # | Title | Lanes | Gates |
|---|-------|-------|-------|
| 0070 | progress-schema-aggregates | W2 | C, D, F |
| 0071 | useRoundOutcome-composable | W2 | C, D, F |
| 0072 | useProgressSummary-composable | W2 | C, D, F |
| 0073 | summary-page-export | W1 | C, D, F |
| 0074 | progress-summary-tests | T | C, D, F |
