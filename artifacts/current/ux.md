# UX: ZAP Workflow Speed

## User Impact

- **Developers:** Shorter CI feedback; less context-switching while waiting.
- **Epic iterations:** 12 min → target <3 min total (2 runs × 90s).

## Non-Functional Requirements

- ZAP gate must complete in ≤90s (stretch: ≤60s) on cache-hit runs.
- Cold runs acceptable up to ~3 min (first run after cache eviction).
- No reduction in security coverage (same URLs scanned).
- CI logs remain debuggable.
