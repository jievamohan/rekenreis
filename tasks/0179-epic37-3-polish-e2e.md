---
id: 0179-epic37-3-polish-e2e
title: Polish + Reduced Motion + E2E
scope_in:
  - prefers-reduced-motion: ambient fish disabled
  - Count 2–5 stable
  - Gate C, D, F green
scope_out: []
lanes: [W1]
file_globs: [apps/web/components/minigames/MinigameFishFeed.vue]
gates: [C, D, F]
risk_tags: []
acceptance:
  - Reduced-motion works
  - E2E and CI green
---

# Epic 37.3 — Polish + Reduced Motion + E2E

## Acceptance criteria
- [ ] prefers-reduced-motion: no swimming fish
- [ ] Count 2–5 stable during session
- [ ] E2E Fish Feed smoke green
- [ ] Gate C, D, F green
