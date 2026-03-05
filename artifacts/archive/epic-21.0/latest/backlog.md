# Epic 21 — Backlog

**Epic:** 21 — Minigame System Expansion + Dutch UI Copy

---

## Work Streams

### WS-1: Foundation (types, composables, i18n infra)
- MinigameId, MinigameDefinition, MinigameMap types
- useMinigame registry composable
- useMinigameServing (shuffle-bag, no-repeat, seed)
- useDifficultyProgression composable
- useI18n composable + nl.json source of truth
- minigame-map.v1.json content file
- ESLint rule: no-hardcoded-english-strings
- Unit tests for all new composables

### WS-2: Dutch UI Copy
- Create apps/web/content/locales/nl.json with all UI strings
- Replace all hardcoded English in pages (index, start, map, play, summary, stickers, settings)
- Replace all hardcoded English in components (AppShell, NavTabs, LevelCompleteModal, MistakesReview, ProblemCard, PlayModeSelector, ParentGate, Keypad, ProfileSelector, etc.)
- Lint gate enforcement
- E2E: verify no English visible on key screens

### WS-3: MinigameRenderer + First 2 Minigames
- MinigameRenderer.vue (dynamic component loader)
- MinigameBubblePop.vue (tap interaction)
- MinigameTreasureDive.vue (drag interaction)
- SVG placeholder assets for both
- Integration with usePlayGame core loop
- Unit + E2E tests

### WS-4: Next 2 Minigames
- MinigameFishFeed.vue (timed scene)
- MinigameCoralBuilder.vue (scene/tap)
- SVG placeholder assets
- Difficulty knob wiring
- Unit + E2E tests

### WS-5: Final 2 Minigames
- MinigameSubmarineSort.vue (drag)
- MinigameStarfishMatch.vue (tap/timed)
- SVG placeholder assets
- Unit + E2E tests

### WS-6: Integration + Polish
- Full flow wiring: map -> play -> minigame -> complete -> map
- Difficulty progression integration across chapters
- Random serving smoke test (no-repeat, variety)
- Visual regression baselines for all 6 minigames
- a11y audit (keyboard, reduced motion, contrast)
- Performance verification (bundle budget)

---

## Dependencies

- WS-1 must complete before WS-3/4/5
- WS-2 is independent (can run parallel with WS-1)
- WS-3 before WS-4 before WS-5 (incremental)
- WS-6 after all others

## Risk Items

- Bundle size growth from 6 new component trees (mitigate: lazy-load)
- i18n completeness (mitigate: lint gate)
- Minigame a11y (mitigate: keyboard fallback required per minigame)
