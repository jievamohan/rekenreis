# Review: Epic 21 — Cohesive App Shell + Map→Level→Game→Feedback→Map Flow

## Summary
Implemented cohesive app shell with consistent navigation, UI visibility rules,
and a complete Map→Play→Feedback→Map flow.

## Changes
| File | Change |
|------|--------|
| types/navigation.ts | NEW: NavigationPage, NavTab, NavigationState types |
| composables/useNavigationState.ts | NEW: route-reactive navigation state composable |
| components/AppShell.vue | MODIFIED: "Back to Map" button, context-aware TopBar |
| components/NavTabs.vue | MODIFIED: aria-current for active tab |
| components/modals/LevelCompleteModal.vue | MODIFIED: "Back to Map" as primary CTA |
| pages/map.vue | MODIFIED: "Choose Level" header, stars total, "Play current" CTA |
| pages/play.vue | MODIFIED: "Exit to Map" button, modal back-to-map handler |
| pages/settings.vue | MODIFIED: removed ad-hoc nav links |
| pages/stickers.vue | MODIFIED: removed ad-hoc nav links |
| pages/summary.vue | MODIFIED: removed ad-hoc nav links |
| e2e/app-flow.spec.ts | NEW: 3 full flow E2E tests |
| e2e/navigation.spec.ts | NEW: 4 navigation visibility E2E tests |
| e2e/level-complete.spec.ts | MODIFIED: updated selector for new modal layout |

## Gates
- C (Typecheck): PASS
- D (Security): PASS (no new deps, no secrets, no auth changes)
- F (Build): PASS (2.34 MB total)
- E2E: 28/32 passed — 4 failures are pre-existing (smoke title, visual baseline)

## Acceptance Criteria
- [x] From /map you can open an unlocked level and play it
- [x] After level completion, return to /map with progress reflected (stars)
- [x] "Back to Map" is primary CTA in level complete modal
- [x] "Exit to Map" button on play page
- [x] "Choose Level" header + stars total + "Play current" CTA on map
- [x] No orphan page without a way back to /map
- [x] Ad-hoc navigation removed from settings/stickers/summary
- [x] E2E covers map→level→finish→back flow
- [x] UI visibility rules: map-only elements isolated, play-only elements isolated
