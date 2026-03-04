# Epic 2: Skin System + 1 Skin — Discovery

## User goal(s) and success metrics

- **Primary**: Add a minigame skin system so the same core game logic can be rendered with different visual themes.
- **Success metrics**:
  - Skin contract (TS) defines rendering interface (round state + callbacks)
  - Core loop (usePlayGame) remains single source of truth — no duplicated logic
  - /play switches skin via query param or config (default: classic)
  - ONE skin implemented: Monster Feed (minimal UI, accessible)
  - Tests: skin selection + contract/callback correctness
  - Existing smoke/e2e green

## Scope_in

- **Skin contract**: TypeScript interface for rendering a round (question, choices, feedback, callbacks)
- **Skin registry/config**: Map skin id → skin component; default "classic"
- **/play updates**: Read skin from `?skin=monster-feed` or config; render via skin component
- **Classic skin**: Current play.vue UI as the default "classic" skin
- **Monster Feed skin**: ONE alternative skin (minimal UI, thematic — feeding a monster)
- **Unit tests**: Skin selection logic, contract/callback correctness
- Keep existing smoke/e2e green; update lightly if needed

## Scope_out

- Multiple skins beyond Monster Feed (Epic 3)
- Rewards/unlocks (Epic 3)
- Persistence (Epic 4)
- Backend changes

## Functional requirements (bulleted, testable)

1. **Skin contract**
   - TS interface: `SkinProps { question, feedback, score, streak, onAnswer, onNext }`
   - Skin components receive props and render; no game logic inside skin
2. **Skin selection**
   - Read from `route.query.skin` or nuxt config; default "classic"
   - Validate skin id against registry; fallback to classic if unknown
3. **Classic skin**
   - Extract current play UI into `SkinsClassic.vue` (or keep inline as default)
4. **Monster Feed skin**
   - New `SkinsMonsterFeed.vue`: minimal UI, accessible (ARIA, keyboard)
   - Thematic: e.g. "feed the monster the right answer"
5. **Tests**
   - Skin selection returns correct component for valid id; fallback for invalid
   - Contract: callbacks invoked with correct args

## Acceptance criteria templates (Given/When/Then)

- **AC-1**: Given skin id "classic", When /play loads, Then classic UI renders.
- **AC-2**: Given skin id "monster-feed", When /play loads, Then Monster Feed skin renders.
- **AC-3**: Given unknown skin id, When /play loads, Then classic (fallback) renders.
- **AC-4**: Given Monster Feed skin, When user selects correct answer, Then onAnswer(correctAnswer) called; feedback shown.
- **AC-5**: All existing smoke/e2e tests pass.
