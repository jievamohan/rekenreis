# Epic 1: Level Contract + Content Pack — QA

## Unit tests

1. **levelValidator.test.ts**
   - Valid Level passes validation.
   - Invalid (missing operator, bad operand ranges, wrong types) fails.

2. **levelGenerator.test.ts**
   - Same seed + config → identical level pack output.
   - Generated levels: operands in range, correct answer in choices, choices unique.
   - choiceCount respected.

3. **usePlayGame.test.ts**
   - Pack mode: questions come from provided pack.
   - Infinite mode: behavior unchanged (existing tests).

## Smoke/e2e

- /play loads in both modes (no regression).
- Answer → feedback → Next works.
- Existing api.test.ts, HealthTest, smoke runbook pass.

## Test matrix

| Scenario | Mode | Expected |
|----------|------|----------|
| /play | infinite (default) | Generated questions |
| /play?mode=pack | pack | Pack questions |
| /play?mode=invalid | infinite | Fallback |
| Empty pack | pack | Fallback to infinite |
