---
id: 0180-epic38-1-fish-visibility-screenshot
title: Fish Visibility + Screenshot
scope_in:
  - MinigameFishFeed.vue: z-index fix (water-level 0, fish-ambient-layer 1)
  - e2e/visual/fish-feed-visual.spec.ts: screenshot with ≥2 fish
scope_out: []
lanes: [W1]
file_globs: [apps/web/components/minigames/MinigameFishFeed.vue, apps/web/e2e/visual/*.spec.ts]
gates: [C, D, F]
risk_tags: []
acceptance:
  - Fish visibly swimming above water
  - Screenshot test passes
  - Gate C, D, F green
---

# Epic 38.1 — Fish Visibility + Screenshot

## Acceptance criteria
- [ ] water-level z-index: 0, fish-ambient-layer z-index: 1
- [ ] Screenshot: /play?level=3, ≥2 fish visible
- [ ] Playwright via docker compose e2e only
- [ ] typecheck, build green
