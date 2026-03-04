# Epic 8 — Content Packs per Mode + Pacing Rules: Solution

## 1. Level Schema Extension

Add to `Level`:

- `modeIds?: InteractionModeId[]` — if present, level applies only to listed modes; if absent, applies to all
- `pacingTag?: 'easy' | 'normal' | 'challenge'` — if absent, derive from `difficultyTag` (easy→easy, medium→normal, hard→challenge)

Backward compatible: existing levels work without these fields.

## 2. Content Packs

- Create `levels.classic.v1.json`, `levels.timed-pop.v1.json`, `levels.build-bridge.v1.json`
- Each contains Level[]; optionally filter by modeIds or use mode-specific packs
- Migrate/split from `levels.v1.json` or generate from levelGenerator with mode-specific configs

## 3. Pacing Engine

- `applyPacing(levels: Level[], seed: number): Level[]`
- Use seeded RNG for deterministic shuffle that respects: no two consecutive challenge
- Algorithm: bucket by pacingTag; interleave so challenge never adjacent

## 4. play.vue Integration

- Map `interactionMode` → pack path
- Load pack for current mode; fallback to infinite or generic pack if missing

## 5. usePlayGame

- When source=pack: apply pacing to levelPack before use
- Pass seed for determinism (session or configurable)
