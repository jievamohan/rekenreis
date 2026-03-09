---
id: "0148"
title: "Epic 30.3 — Mistakes Review + Introductie MaatjeAvatar"
scope_in:
  - MistakesReview: replace MascotIcon with MaatjeAvatar (expression nadenken)
  - Start and/or index: add maatje with Neutraal of Blij (introductie)
  - nl.json: aria-labels voor maatje waar nodig
  - E2E: mistakes review maatje visible; start page maatje visible
scope_out:
  - Profile maatje selection (Epic 30.4)
lanes:
  W1: apps/web/components/review/MistakesReview.vue, apps/web/pages/start.vue, apps/web/pages/index.vue
  T: apps/web/e2e/**/*.spec.ts
gates:
  - C
  - D
  - F
risks: []
acceptance:
  - Mistakes review toont maatje (nadenken)
  - Start/index toont maatje (neutraal of blij)
  - E2E passes
status: pending
---

# Epic 30.3 — Mistakes Review + Introductie MaatjeAvatar

## Acceptance Criteria

1. **MistakesReview**: Replace MascotIcon with MaatjeAvatar (character: wolkje, expression: nadenken). Fallback to MascotIcon if asset missing.
2. **Index**: Add MaatjeAvatar (wolkje, blij) for introductie.
3. **Start**: Add MaatjeAvatar (wolkje, neutraal) for introductie.
4. **nl.json**: Add aria-labels for maatje where needed.
5. **E2E**: Assert mistakes review maatje visible; start page maatje visible.
