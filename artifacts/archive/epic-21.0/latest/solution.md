# Epic 21: Solution Design

**Role:** Solution Designer  
**Scope:** File locations, build impact, content/i18n pipelines, performance, migration

---

## 1. File Locations

### Types

| File | Purpose |
|------|---------|
| `apps/web/types/minigame.ts` | MinigameId, MinigameDefinition, MinigameMap schema |
| `apps/web/types/difficulty.ts` | DifficultyProgression |

### Composables

| File | Purpose |
|------|---------|
| `apps/web/composables/useMinigame.ts` | Registry, resolution, component lookup |
| `apps/web/composables/useMinigameServing.ts` | Shuffle bag, no-repeat window, seeded RNG |
| `apps/web/composables/useDifficultyProgression.ts` | Compute math ranges + minigame params from level/chapter |
| `apps/web/composables/useI18n.ts` | Dutch text lookup from nl.json |

### Components

| File | Purpose |
|------|---------|
| `apps/web/components/minigames/MinigameRenderer.vue` | Dynamic loader, lazy-loads minigame components |
| `apps/web/components/minigames/MinigameBubblePop.vue` | Bubble-pop interaction |
| `apps/web/components/minigames/MinigameTreasureDive.vue` | Treasure-dive interaction |
| `apps/web/components/minigames/MinigameFishFeed.vue` | Fish-feed interaction |
| `apps/web/components/minigames/MinigameCoralBuilder.vue` | Coral-builder interaction |
| `apps/web/components/minigames/MinigameSubmarineSort.vue` | Submarine-sort interaction |
| `apps/web/components/minigames/MinigameStarfishMatch.vue` | Starfish-match interaction |

### Content

| File | Purpose |
|------|---------|
| `apps/web/content/minigame-map.v1.json` | levelId → minigameId / weighted pool mapping |
| `apps/web/content/locales/nl.json` | Dutch UI copy (source of truth) |

### Integration

| File | Change |
|------|--------|
| `apps/web/composables/useMode.ts` | No change (modes remain; minigames are per-level interaction) |
| `apps/web/pages/play.vue` (or equivalent) | Integrate MinigameRenderer, useMinigameServing, useDifficultyProgression |
| `apps/web/composables/usePlayGame.ts` | No structural change; caller wires minigame selection |

---

## 2. Build / Bundle Impact

- **New chunks:** 6 minigame components + MinigameRenderer; all minigames lazy-loaded via `defineAsyncComponent`
- **Main bundle:** Only MinigameRenderer + composables + types; minigame code in separate async chunks
- **Budget:** Must stay within existing bundle-size budget (Gate F); lazy-loading keeps initial load small
- **Content:** minigame-map.v1.json and nl.json are static assets; included in build, no extra runtime fetch

---

## 3. Content Pipeline

### minigame-map.v1.json

- **Loading:** Static import at build time: `import minigameMap from '~/content/minigame-map.v1.json'`
- **Validation:** Optional JSON schema check at build or in composable; invalid structure falls back to default (e.g. bubble-pop for all)
- **No runtime fetch:** Keeps latency zero, works offline

---

## 4. i18n Pipeline

### nl.json

- **Format:** Flat `{ "key": "Dutch text" }`
- **Loading:** Static import in useI18n: `import nl from '~/content/locales/nl.json'`
- **useI18n:** Returns `t(key)` that looks up `nl[key]` or returns key as fallback
- **No vue-i18n:** Epic 21 uses single locale; custom composable is sufficient

---

## 5. Performance

- **Lazy-load minigames:** Each minigame component loaded on first use
- **Bundle budget:** Gate F baseline must pass; minigame chunks excluded from initial bundle
- **Deterministic RNG:** No performance impact; seedableRng is lightweight
- **No new API calls:** All content static; no network for minigame/i18n data

---

## 6. Docker / CI Impact

- **None expected:** No new services, no new build steps
- **Assets:** CSS/SVG only for minigames; no new Docker layers
- **Typecheck / PHPStan:** New TS types; no API changes

---

## 7. Migration Path

- **Existing levels:** Unchanged; level schema (operator, operandMin, operandMax, etc.) stays the same
- **Minigame map:** Levels not covered by map entries get a default minigame (e.g. bubble-pop)
- **Modes:** classic, timed-pop, build-bridge remain; minigames are additive interaction layer within a mode
- **Persistence:** usePersistence, useLevelProgress unchanged; no migration of stored data
