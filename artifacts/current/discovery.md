# Discovery: Browser Console Hydration Errors

## Summary
Vue hydration mismatches on `/play` page cause console warnings. Server-rendered HTML differs from client-rendered HTML because of client-only state and non-deterministic data.

## Root Causes

### 1. Random question generation (ModeBuildBridge)
- `generateAdditionQuestion()` uses `Math.random` (no seed)
- Server: one random question (e.g. 4+1=?)
- Client: different random question (e.g. 7+1=?)
- Mismatch: prompt text, plank numbers

### 2. Skin lock state (play.vue ~214–226)
- `isUnlocked()` depends on `bestScore` from `usePersistence` / profile
- Server: `loadProgress()` returns `{ bestScore: 0 }` (no localStorage)
- Client: reads actual bestScore from localStorage
- Mismatch: server shows locked, client expects unlocked (or vice versa)

### 3. Telemetry checkbox (play.vue ~242)
- `telemetryOptOut` from `useTelemetry` / profile
- Server: `getOptOut()` returns true when `window === undefined`; `createFreshSchema()` uses `telemetryOptOut: true`
- Client: reads from localStorage (may be false)
- Mismatch: server checked, client unchecked

### 4. Suspense warning
- Nuxt/Vue internal; not from our code

## Affected Files
- `apps/web/pages/play.vue`
- `apps/web/components/modes/ModeBuildBridge.vue`
- Composables: `usePlayGame`, `useRewards`, `useTelemetry`, `usePersistence`, `useProfile`
