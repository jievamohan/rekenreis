# Epic 6 — Game Modes Framework: QA

## Unit Tests

- **modeResolver**: resolveInteractionMode returns classic/timed-pop from query; unknown → classic
- **usePlayGame.recordTimeout**: sets feedback to timeout type, no score change, nextQuestion works
- **useMode**: returns correct component for classic and timed-pop
- **timed-pop timer**: with vi.useFakeTimers, timer expires → recordTimeout called → feedback shows timeout

## Integration

- Mode switch: changing route.query.mode updates rendered mode
- Timed-pop: answer before timeout works; timeout shows correct feedback
- Backward compat: /play?mode=pack still yields pack content

## Smoke (manual)

- /play → classic
- /play?mode=classic → classic
- /play?mode=timed-pop → timed-pop, timer visible
- /play?mode=timed-pop: wait for timeout → "Time's up!" → Next → new question
- /play?mode=pack → pack content (source=pack)
- /play?mode=timed-pop&source=pack → timed-pop with pack

## Regression

- Existing skins work in classic mode
- /play?skin=X still works
- Typecheck, lint, build pass
