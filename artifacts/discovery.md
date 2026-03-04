# Epic 12 — Rewards Expansion: Discovery

## Feature Summary

Expand rewards into a sticker book (pages, categories, "new" highlight) and optional daily goal ("play 5 rounds"). Persist per profile. Celebratory but short; never blocks play.

## Current State

- **Rewards**: useRewards derives unlocked skins from bestScore; UNLOCK_THRESHOLDS per skin
- **Profile**: progress.bestScore only; no daily or sticker data
- **UI**: Skin picker inline + in PlayModeSelector; no sticker book
- **Date**: Date.now() only; no timezone-safe local date

## Requirements (from Epic)

1. **Sticker book**: pages, categories, "new sticker" highlight
2. **Daily goal** (optional): "play 5 rounds" reward; timezone-safe local calculation
3. **Persist rewards per profile**
4. **Tests**: daily reset logic, reward unlocking rules
5. **UX**: celebratory but short; never blocks play

## Non-goals

- Monetization
- Leaderboards

## Key Files

- `apps/web/utils/profileSchema.ts` — extend progress with dailyGoal
- `apps/web/utils/rewardsConfig.ts` — sticker categories, map skins to stickers
- `apps/web/composables/useDailyGoal.ts` — new: today (local), rounds, reset
- `apps/web/composables/useRewards.ts` — already profile-aware
- `apps/web/pages/stickers.vue` — new: sticker book UI
- `apps/web/pages/play.vue` — optional daily goal widget
