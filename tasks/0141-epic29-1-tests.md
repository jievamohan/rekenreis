---
id: "0141"
status: "done"
title: "epic29-1-tests"
scope_in:
  - "apps/web/test/starScoring.test.ts"
  - "apps/web/test/useLevelProgress.test.ts"
scope_out:
  - "E2E (29.2)"
lanes: ["T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "computeStars: boundary cases (0, 2, 3, 5, 6, 8, 9, 10 correct for 10 rounds)"
  - "useLevelProgress: 0 stars accepted, best-only on replay, upgrade on better replay"
  - "Typecheck, build green"
---

# Epic 29.1 — Unit Tests

## Goal

Unit tests for computeStars and useLevelProgress (0 stars, best-only).

## Implementation

1. Create `apps/web/test/starScoring.test.ts`:
   - <3 correct = 0 stars; 3–5 = 1; 6–8 = 2; 9–10 = 3
   - Custom thresholds
   - 5 rounds with default-derived thresholds
2. Update `apps/web/test/useLevelProgress.test.ts`:
   - completeLevel(1, 0) stores 0 stars
   - Remove or update "clamps stars to 1–3" test (now 0–3)
   - best-only and upgrade tests unchanged
