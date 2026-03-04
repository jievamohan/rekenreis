# Epic 3 Discovery

## Summary
Add 2 additional skins and simple rewards/unlocks to the rekenreis math game. All changes stay in web app; no API changes. Local-only rewards; a11y preserved; bundle within budget.

## Current State
- Skin contract exists: `SkinRoundProps`, `SkinDefinition` in `types/skin.ts`
- Existing skins: `classic`, `monster-feed`
- Skin resolution: `skinResolver.ts`, `useSkin.ts`
- Play page: `route.query.skin` drives skin selection
- No rewards/unlocks; no persistence

## Scope
- **In**: 2 new skins (reuse contract), rewards/unlocks (local-only), tests, a11y preserved
- **Out**: API, auth, payments, heavy assets, complex animations
