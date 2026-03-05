---
id: "0116"
title: "E2E tests for full flow and navigation"
lane: T
depends_on: ["0115"]
scope_in:
  - apps/web/e2e/app-flow.spec.ts
  - apps/web/e2e/navigation.spec.ts
scope_out:
  - components
  - composables
  - pages (test only)
gates: [C, D, F]
risk_tags: []
---

## Objective
Add container-only Playwright E2E tests covering the core game flow and navigation.

## Acceptance Criteria
- [ ] `app-flow.spec.ts`: map → open level → complete → back to map (progress visible)
- [ ] `navigation.spec.ts`: navigate to settings and back to map
- [ ] `navigation.spec.ts`: NavTabs visible on all checked pages
- [ ] `navigation.spec.ts`: "Back to Map" visible on non-map pages, hidden on /map
- [ ] Tests run via `docker compose run --rm e2e` only
- [ ] All tests pass
