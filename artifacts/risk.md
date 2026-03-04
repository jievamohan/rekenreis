# Task 0008: Level Schema Validator — Risk

## Risk areas

| Area | Level | Mitigation |
|------|-------|------------|
| deps | Low | Add Zod; Gate F enforces bundle budget |
| perf | Negligible | Validation runs on load; small JSON |

## High-risk changes

- None. No auth, crypto, payments, or data-loss.
