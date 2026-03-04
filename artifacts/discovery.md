# Epic 7 — Second Mode (Drag & Drop) + Mode Selector UI: Discovery

## Feature Summary

Add a second new game mode (build-bridge) using drag-and-drop interaction, plus a kid-friendly mode selector UI reachable from /play. Mode selector allows choosing Mode and optionally Skin, with last selection persisted locally.

## Current State

- **Modes**: classic (click/tap), timed-pop (timer + click)
- **Skins**: classic, monster-feed, space, pirate (with unlock rewards)
- **Routing**: /play uses route.query.mode and route.query.skin
- **Mode contract**: InteractionModeId = 'classic' | 'timed-pop', ModeDefinition in types/mode.ts
- **Core loop**: usePlayGame is single source of truth; modes only change interaction pattern
- **Persistence**: localStorage for telemetry opt-out; no current mode/skin preference persistence

## Requirements (from Epic)

1. Mode selector UI: big buttons with icons, reachable from /play
   - Choose Mode + optionally Skin
   - Remember last selection (local)
2. build-bridge mode: drag/drop
   - Show gap/bridge with planks labeled with answers (or draggable tiles)
   - Player drags correct plank/tile into place
   - Friendly feedback, no fail state; on wrong: gentle hint
3. Core loop remains source of truth; mode only changes interaction pattern
4. Accessibility: keyboard alternative (select + place) for users without drag support
5. Tests: mode selector routing + persistence; build-bridge logic deterministic (fake timers/DOM events)
6. E2E: smoke covers switching to build-bridge and completing one round

## Non-goals

- More than 2 modes total (classic + timed-pop + build-bridge = 3 modes; Epic says "second mode" meaning second new mode after timed-pop, so build-bridge is the third mode overall but second additional mode)
- New operators (addition only)

## Key Files

- `apps/web/types/mode.ts` — extend InteractionModeId
- `apps/web/utils/modeResolver.ts` — add build-bridge
- `apps/web/composables/useMode.ts` — register ModeBuildBridge
- `apps/web/components/modes/ModeBuildBridge.vue` — new component
- `apps/web/pages/play.vue` — add mode selector entry point
- New: mode selector component/page
- New: localStorage key for last mode/skin
