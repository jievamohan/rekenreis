# Backlog: Fix Hydration Console Errors

## Epic
Fix Vue hydration mismatches on /play page to eliminate browser console warnings.

## Scope_in
- Disable SSR for /play route (simplest, reliable fix for game page with heavy client state)
- OR: Use ClientOnly for client-dependent UI (skin picker, game, checkbox)
- Ensure typecheck, build, and CI pass

## Scope_out
- Changing game logic or UX
- Fixing Suspense experimental warning (Nuxt internal)

## Risks
- **perf**: Disabling SSR for /play means no server-rendered HTML for that route; acceptable for game page
- **seo**: Play page won't be indexed with content; acceptable for interactive game

## Task
1. **Fix hydration** (Lane W1): Add `routeRules: { '/play': { ssr: false } }` to nuxt.config.ts
