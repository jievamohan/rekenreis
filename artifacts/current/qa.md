# Epic 17 — Graphics v1: QA Strategy

## Unit Tests

| Area | Test |
|------|------|
| Mode contract | ModeBuildBridge receives SkinRoundProps, calls onAnswer/onNext correctly |
| Drag/drop state | Wrong drop: wobble, plank returns, no onNext; correct: onAnswer, onNext |
| Hint integration | After 2 wrong, hintToShow is used; hint displayed |
| Keyboard | Select plank, focus drop zone, place; same outcome as drag |
| Reduced motion | prefers-reduced-motion: reduce disables wobble (mock matchMedia or CSS test) |

## E2E / Smoke

| Flow | Verification |
|------|---------------|
| Switch to build-bridge | /play → Choose game → Build Bridge → scene visible |
| Complete one round | Drag correct plank to gap → feedback "Correct!" → Next → new question |
| Wrong then correct | Wrong plank → wobble, try again → correct plank → success |

## Manual Smoke (docs/runbooks)

- Update smoke steps 10–11 to reflect graphical build-bridge
- Verify classic, timed-pop unchanged

## Performance

- Bundle size within budget (no heavy libs)
- No layout thrash; CSS/SVG only
