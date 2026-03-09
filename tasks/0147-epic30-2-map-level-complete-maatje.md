---
id: "0147"
title: "Epic 30.2 — Map + Level Complete MaatjeAvatar Integration"
scope_in:
  - MapAvatar: replace emoji with MaatjeAvatar (wolkje, blij); fallback emoji if asset missing
  - LevelCompleteModal: replace MascotIcon with MaatjeAvatar; expression from stars (0→verdrietig, 1→neutraal, 2→blij, 3→feest)
  - E2E: map avatar visible; level complete maatje visible with correct expression
scope_out:
  - Profile maatje selection (Epic 30.4)
  - Mistakes review / start page maatje (Epic 30.3)
lanes:
  W1: apps/web/components/map/MapAvatar.vue, apps/web/components/modals/LevelCompleteModal.vue
  T: apps/web/e2e/**/*.spec.ts
gates:
  - C
  - D
  - F
risks: []
acceptance:
  - Map toont maatje op huidige node (wolkje, blij)
  - Level complete toont maatje met juiste expressie voor 0/1/2/3 sterren
  - Fallback naar emoji/MascotIcon als maatje asset ontbreekt
  - E2E: map avatar visible; level complete maatje visible
status: pending
---

# Epic 30.2 — Map + Level Complete MaatjeAvatar Integration

## Acceptance Criteria

1. **MapAvatar**: Use MaatjeAvatar (character: wolkje, expression: blij), size sm (40px). Fallback to emoji (🐠) if resolve returns empty.
2. **LevelCompleteModal**: Replace MascotIcon with MaatjeAvatar. Expression mapping: stars 0→verdrietig, 1→neutraal, 2→blij, 3→feest. Fallback to MascotIcon if resolve returns empty.
3. **E2E**: Assert map avatar visible; level complete maatje visible with correct expression.

## Implementation Notes

- useMaatje.resolve already implements fallback chain (expression → blij → neutraal → first available)
- MaatjeAvatar returns empty src when asset missing; parent must handle fallback
- wolkje has: blij, neutraal, verdrietig, nadenken (no feest); use fallback chain for feest
