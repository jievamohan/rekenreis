# Tests — Epic 22.1

**Status:** PASS
**Command:** `docker compose exec web pnpm run test`
**Result:** 28 test files, 219 tests passed (0 failures).

New tests added:
- `test/contractV2.test.ts` — 20 tests covering:
  - Contract v2 field validation (interactionType, requiredInputs, layoutClass, knobs, timerPolicy)
  - Collection-level duplication checks (isNew + justification)
  - Registry completeness (all 6 minigames have valid v2 metadata)
  - Enum value correctness
  - Timer policy safety (hint-continue, allowDisable)
