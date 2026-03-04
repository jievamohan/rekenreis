# Epic 6 — Game Modes Framework: Solution

## 1. Types & Contract

- Add `InteractionModeId = 'classic' | 'timed-pop'` in `types/mode.ts`
- Extend `PlayFeedback`: `{ correct, selectedAnswer } | { type: 'timeout', correctAnswer }`
- `ModeDefinition`: id, component (like SkinDefinition)

## 2. Query Param Handling

- play.vue: `source` from `route.query.source ?? (route.query.mode === 'pack' ? 'pack' : 'infinite')`
- `interactionMode` from `route.query.mode` when classic|timed-pop else 'classic'

## 3. usePlayGame Extension

- Add `recordTimeout()`: if question exists and no feedback yet, set `feedback = { type: 'timeout', correctAnswer: question.correctAnswer }`, no score change

## 4. Mode Registry

- useMode(interactionModeId) returns ModeDefinition
- ModeClassic: wraps current skin-based round (pass SkinRoundProps to skin)
- ModeTimedPop: renders round with timer; on timeout calls recordTimeout; uses same SkinRoundProps shape for consistency

## 5. Timed-pop Implementation

- Timer: configurable (default 15s), use setInterval/ref
- On expiry: clear timer, call recordTimeout(), show feedback
- UI: question + choices (same structure as classic) + timer display (e.g. "0:12" countdown)
- Tests: use vi.useFakeTimers() for deterministic timer behavior

## 6. Routing & Play Page

- Resolve interactionMode from query
- Resolve mode component; pass game state + callbacks (including recordTimeout for timed mode)
- Render `<component :is="mode.component" v-bind="modeProps" />`

## 7. Smoke

- Update docs/runbooks: add step for /play?mode=timed-pop, verify timer and timeout flow
