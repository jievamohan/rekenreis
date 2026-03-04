# Epic 3 Solution

1. **Skin A + Skin B**: Create two Vue components implementing SkinRoundProps (e.g. space, pirate themes). Update SKIN_IDS, REGISTRY, skinResolver.
2. **Rewards composable**: `useRewards(score)` returns unlocked skin ids. Thresholds: e.g. 0→classic,monster-feed; 5→skinA; 10→skinB.
3. **Minimal UI**: In play page or skin selector: show available skins; locked skins greyed with lock icon.
4. **Tests**: Unit tests for unlock logic; integration for skin switching via query param.
