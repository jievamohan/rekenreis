# Epic 6 — Game Modes Framework: Discovery

## Summary

Introduce a Game Modes framework so different interaction patterns (classic click, timed-pop) can coexist without duplicating core logic. Modes are higher-level than skins: mode = interaction pattern, skin = visual theme.

## Current State

- **usePlayGame**: Core loop (question, score, streak, feedback, selectAnswer, nextQuestion). Uses GameMode = upTo10 | upTo20 (difficulty).
- **Skin contract**: SkinRoundProps (question, feedback, score, streak, mode, onAnswer, onNext, onModeChange). Skins render the round.
- **play.vue**: route.query.mode = 'pack' | undefined for content source (pack vs infinite). route.query.skin for skin. mode ref = GameMode (difficulty).
- **Naming conflict**: Epic wants /play?mode=classic and /play?mode=timed-pop. Current route.query.mode = pack for content. Resolution: use route.query.source for pack/infinite, route.query.mode for classic/timed-pop. Backward compat: route.query.mode=pack → source=pack.

## Scope

- GameMode (interaction) contract: InteractionModeId = 'classic' | 'timed-pop'
- Mode registry + resolution from query
- /play?mode=classic (default), /play?mode=timed-pop
- Implement timed-pop: question + 3–4 choices + configurable timer; on timeout: friendly feedback, reveal answer, continue (no fail)
- a11y: keyboard, timer does not block progress
- Tests: mode selection, timer (fake), smoke extended

## Out of Scope

- Multiple new modes (only timed-pop)
- Backend persistence/auth
- Second mode (Epic 7: build-bridge)
