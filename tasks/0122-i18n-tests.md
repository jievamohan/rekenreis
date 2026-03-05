---
id: "0122"
title: "Unit + E2E tests for i18n"
epic: "21.1"
lane: T
gates: [C, D, F]
risk_tags: []
depends_on: ["0119", "0120"]
scope_in:
  - apps/web/test/useI18n.test.ts
  - apps/web/e2e/smoke.spec.ts (update for Dutch text)
  - apps/web/e2e/i18n.spec.ts (new)
scope_out:
  - Visual regression screenshots
  - Component-level unit tests for each translated component
acceptance:
  - Unit test: t('common.next') returns 'Volgende'
  - Unit test: t('play.wrong', { answer: 7 }) returns interpolated string
  - Unit test: t('missing.key') returns 'missing.key'
  - Unit test: all nl.json leaf keys are non-empty strings
  - E2E smoke tests updated for Dutch text selectors
  - E2E i18n test verifies no English visible on /map, /play, /settings
  - All tests pass (docker compose run --rm e2e for Playwright)
  - Typecheck clean
---

# 0122 — Unit + E2E tests for i18n

## What
Add unit tests for the useI18n composable and update/create E2E tests for Dutch text verification.

## Implementation

### apps/web/test/useI18n.test.ts
- Test simple key lookup
- Test nested key lookup
- Test interpolation with params
- Test missing key fallback
- Test all leaf keys in nl.json are non-empty

### apps/web/e2e/smoke.spec.ts
- Update any text-based selectors to use Dutch text or data-testid
- Ensure smoke test still passes after i18n migration

### apps/web/e2e/i18n.spec.ts (new)
- Navigate to /map — verify Dutch headings
- Navigate to /play — verify Dutch labels (score, streak, etc.)
- Navigate to /settings — verify Dutch labels
- Assert no common English words visible in page body

## Acceptance
- [ ] Unit tests pass for useI18n
- [ ] E2E smoke tests pass with Dutch text
- [ ] E2E i18n verification passes
- [ ] All via docker compose for Playwright
