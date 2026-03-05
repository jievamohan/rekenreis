# Architecture: Epic 21

## Approach
Introduce a single `useNavigationState` composable that reads the current route and
exposes all UI visibility decisions. AppShell consumes it and conditionally renders
elements based on page context.

## New Types
- `types/navigation.ts`: `NavigationPage`, `NavigationState` interface

## New Composable
- `composables/useNavigationState.ts`: route-reactive, returns currentPage, activeTab,
  canGoBackToMap, isMapPage, isPlayPage, currentLevelId, selectedMode

## Modified Components
- AppShell.vue: consume useNavigationState, show/hide TopBar elements, add "Back to Map"
- NavTabs.vue: mark active tab as current (aria-current), dim/disable own tab
- map.vue: add "Play current" CTA, stars total
- play.vue: add "Exit to Map" button
- settings.vue, stickers.vue, summary.vue: remove ad-hoc nav, rely on AppShell

## No Changes
- No new dependencies
- No DB/API changes
- No layout restructuring (default/bare layouts remain)
