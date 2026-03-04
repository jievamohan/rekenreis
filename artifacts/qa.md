# Epic 8 — Content Packs per Mode + Pacing Rules: QA

## Unit Tests

- **pacingEngine**: No two consecutive challenge levels; same seed => same sequence; empty/single level edge cases
- **levelValidator**: Accept modeIds (array of valid InteractionModeId), pacingTag (easy/normal/challenge); reject invalid
- **pack schema**: Validate each JSON file parses and validates as Level[]

## E2E

- Smoke: pack mode works for classic, timed-pop, build-bridge
- Switch mode + play one round each
- No regressions to infinite mode

## Manual

- Verify sessions feel varied
- Spot-check: no obvious hard clusters
