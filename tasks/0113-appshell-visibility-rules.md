---
id: "0113"
title: "Refactor AppShell with UI visibility rules"
lane: W1
depends_on: ["0112"]
scope_in:
  - apps/web/components/AppShell.vue
  - apps/web/components/NavTabs.vue
scope_out:
  - pages
  - composables (except consuming useNavigationState)
  - layouts
gates: [C, D, F]
risk_tags: []
---

## Objective
Update AppShell and NavTabs to consume useNavigationState and apply UI visibility rules.

## Acceptance Criteria
- [ ] AppShell uses `useNavigationState` for all visibility decisions
- [ ] "Back to Map" button visible on all pages except /map
- [ ] TopBar shows profile pill + context-aware elements
- [ ] "Choose game" only appears when handler is registered (play page)
- [ ] NavTabs marks active tab with `aria-current="page"`
- [ ] NavTabs remain visible on all pages
- [ ] Typecheck passes
