# Epic 8 — Content Packs per Mode + Pacing Rules: Discovery

## Feature Summary

Introduce content packs per game mode (classic, timed-pop, build-bridge) with pacing rules to keep sessions varied and frustration-free for young learners (kleuters).

## Current State

- **Level schema**: `Level` in types/level.ts has operator, operandMin/Max, choiceCount, hintMode, difficultyTag; no mode applicability
- **Content**: Single `levels.v1.json` used for all modes when `source=pack`
- **play.vue**: Uses same level pack regardless of interaction mode; level pack chosen by `playSource` (pack vs infinite)
- **usePlayGame**: Accepts levelPack; cycles through by index; fixed seed 42 for packRng
- **Pacing**: None; levels presented in pack order
- **Modes**: classic, timed-pop, build-bridge (InteractionModeId)

## Requirements (from Epic)

1. Extend level schema:
   - `modeId` applicability (classic | timed-pop | build-bridge or array thereof)
   - Pacing tags: easy/normal/challenge (rename or align with existing difficultyTag)
   - Optional hint defaults
2. Content packs per mode:
   - `levels.classic.v1.json`
   - `levels.timed-pop.v1.json`
   - `levels.build-bridge.v1.json`
3. Pacing engine:
   - Mix easy/normal/challenge in a predictable pattern
   - Never cluster hard items back-to-back for kleuters
4. Determinism: same seed => same sequence per mode
5. Tests: pacing invariants, pack schema validation
6. E2E: verify pack mode works for all modes without regressions

## Non-goals

- Adaptive learning (later epic)
- Backend content management

## Key Files

- `apps/web/types/level.ts` — extend Level with modeIds?, pacingTag
- `apps/web/utils/levelValidator.ts` — validate new fields
- `apps/web/content/` — add levels.classic.v1.json, levels.timed-pop.v1.json, levels.build-bridge.v1.json
- `apps/web/utils/pacingEngine.ts` — new: pacing logic
- `apps/web/composables/usePlayGame.ts` — use pacing engine when source=pack
- `apps/web/pages/play.vue` — load pack by mode
