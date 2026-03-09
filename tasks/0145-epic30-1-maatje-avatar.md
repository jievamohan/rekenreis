---
id: 0145
slug: epic30-1-maatje-avatar
title: Epic 30.1 — MaatjeAvatar.vue component
epic: 30.1
lanes: [W1]
scope_in:
  - Create components/characters/MaatjeAvatar.vue
  - Props: character, expression, size? (sm|md|lg)
  - Render img via useMaatje
scope_out:
  - Integration in MapAvatar, LevelCompleteModal (Epic 30.2)
acceptance:
  - MaatjeAvatar renders correct img for given character + expression
  - Sizes: sm 40px, md 64px, lg 80px
  - object-fit: contain
  - role="img" with aria-label
gates: [C, D, F]
risk_tags: []
---

# Task 0145 — MaatjeAvatar component

## Acceptance

- [ ] MaatjeAvatar.vue accepts character, expression, size
- [ ] Renders img with correct src from useMaatje
- [ ] Sizes: sm 40px, md 64px, lg 80px
- [ ] object-fit: contain
- [ ] Typecheck clean
