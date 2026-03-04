# Epic 3 Architecture

## Web
- **Skins**: Add SkinSpace.vue, SkinPirate.vue (or similar); register in useSkin + skinResolver
- **Rewards**: Composable `useRewards` with unlock state (localStorage or in-memory)
- **Data**: Unlock thresholds (e.g. score 5 → skin A, score 10 → skin B) stored in config

## No Backend
- All persistence local (session or localStorage)
- No API endpoints
