---
id: 0146
slug: epic30-1-unit-tests
title: Epic 30.1 — Unit tests for useMaatje and MaatjeAvatar
epic: 30.1
lanes: [T]
scope_in:
  - Unit tests for useMaatje (resolve, fallback)
  - Unit tests for MaatjeAvatar (render)
scope_out:
  - E2E (Epic 30.2)
acceptance:
  - useMaatje: resolve returns path; fallback when expression missing
  - MaatjeAvatar: renders img with correct src
  - All tests pass
gates: [C, D, F]
risk_tags: []
---

# Task 0146 — Unit tests

## Acceptance

- [ ] useMaatje resolve returns valid path for known character+expression
- [ ] useMaatje fallback (e.g. slimme-rekenaar + verrast → blij)
- [ ] MaatjeAvatar renders with correct src
- [ ] Typecheck, build green
