# Fix browser console hydration errors on /play

Disable SSR for `/play` route to eliminate Vue hydration mismatches caused by:
- Random question generation (server vs client different)
- Client-only state (localStorage: bestScore, telemetryOptOut)
- Profile data from localStorage

## Tasks
- [x] Add routeRules: { '/play': { ssr: false } } to nuxt.config.ts

## PR Metadata
- Base: main
- Branch: feat/hydration-console-errors
- PR: #42
- URL: https://github.com/jievamohan/rekenreis/pull/42
