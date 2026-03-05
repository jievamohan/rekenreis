---
id: "0112"
title: "Route state contract + useNavigationState composable"
lane: W2
depends_on: []
scope_in:
  - apps/web/types/navigation.ts
  - apps/web/composables/useNavigationState.ts
scope_out:
  - components
  - pages
  - layouts
  - tests
gates: [C, D, F]
risk_tags: []
---

## Objective
Create a centralized TypeScript contract and composable for route-based navigation state.
All UI visibility decisions must flow from this single composable.

## Acceptance Criteria
- [ ] `types/navigation.ts` defines `NavigationPage` and `NavigationState`
- [ ] `composables/useNavigationState.ts` reads `useRoute()` and returns reactive `NavigationState`
- [ ] `currentPage` correctly maps route path to page enum
- [ ] `canGoBackToMap` is true on all pages except /map
- [ ] `isPlayPage` and `isMapPage` flags work
- [ ] `currentLevelId` parsed from route query when on /play
- [ ] Typecheck passes
