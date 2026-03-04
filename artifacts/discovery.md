# Epic 10 — Child Profiles (Local) + Parent Gate: Discovery

## Feature Summary

Add local child profiles so multiple kids can use the same device. Each profile has name, avatar, per-profile progress/rewards/preferences. Parent gate protects settings access. Large tap targets, minimal reading.

## Current State

- **Progress**: persistenceSchema.ts — single bestScore (rekenreis_progress)
- **Preferences**: usePlayPreferences — lastMode, lastSkin (global keys)
- **Telemetry**: useTelemetry — opt-out (global)
- **Rewards**: useRewards — unlocks derived from score; no per-profile persistence
- **Settings UI**: None; mode/skin via PlayModeSelector; no difficulty/hints settings
- **Profile**: No concept of profiles

## Requirements (from Epic)

1. **Local profiles**: name, avatar; per-profile progress, unlocked rewards, last mode/skin
2. **Parent gate**: hold 3 seconds or simple arithmetic for settings access
3. **Settings per profile**: difficulty ceiling (10/20), hints on/off (default on)
4. **Tests**: storage versioning/migration per profile, parent gate behavior
5. **UX**: large tap targets, minimal reading

## Non-goals

- Accounts/login
- Cloud sync

## Key Files

- `apps/web/utils/profileSchema.ts` — new: ProfileSchemaV1, profiles list, activeProfileId
- `apps/web/utils/persistenceSchema.ts` — extend or replace with per-profile keys
- `apps/web/composables/useProfile.ts` — new: active profile, switch, create
- `apps/web/composables/usePlayPreferences.ts` — read/write from active profile
- `apps/web/components/ProfileSelector.vue` — new: create/switch profiles
- `apps/web/components/ParentGate.vue` — new: hold or arithmetic
- `apps/web/pages/play.vue` — profile selector entry, wire to profile data
