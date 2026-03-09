---
id: 0144
slug: epic30-1-types-matrix-composable
title: Epic 30.1 — types/maatje.ts + maatje-matrix + useMaatje
epic: 30.1
lanes: [W2]
scope_in:
  - Create types/maatje.ts (MaatjeId, ExpressionId)
  - Create content/maatje-matrix.ts (character × expression → path)
  - Create composables/useMaatje.ts (resolve with fallback)
scope_out:
  - MaatjeAvatar component
  - Map/LevelComplete integration
acceptance:
  - MaatjeId union: wolkje | een-oog-eerlijk | slimme-rekenaar
  - ExpressionId union: blij | neutraal | verdrietig | nadenken | feest | verrast
  - useMaatje.resolve(character, expression) returns asset path
  - Fallback: expression → blij → neutraal → first available
gates: [C, D, F]
risk_tags: []
---

# Task 0144 — types + matrix + useMaatje

## Acceptance

- [ ] types/maatje.ts defines MaatjeId and ExpressionId
- [ ] maatje-matrix.ts maps character × expression → path
- [ ] useMaatje composable: resolve(character, expression) with fallback chain
- [ ] Typecheck clean
