# Discovery: Epic 21 — App Shell + Flow

## Current State
- AppShell exists with TopBar (profile pill + "Choose game") and NavTabs
- Map page at /map with bare layout (nodes, path, avatar)
- Play page with keypad mode (levels) and classic mode (skins)
- LevelCompleteModal with Next/Review/Close
- Level progress persisted via useLevelProgress
- Settings/Stickers/Summary pages have ad-hoc navigation links

## Gaps Identified
1. No centralized route state contract (TypeScript)
2. No "Back to Map" control in AppShell (pages use ad-hoc links)
3. TopBar always shows "Choose game" regardless of context
4. NavTabs don't reflect active page meaningfully (styling only)
5. No "Exit to Map" on play page
6. Map-only elements (progress summary) not gated by composable
7. No E2E test for full map→play→complete→map flow
8. No map.spec.ts test file

## Risk
- Low: all changes are UI/routing, no auth/payments/crypto
- No DB changes, no API changes
- No new dependencies expected
