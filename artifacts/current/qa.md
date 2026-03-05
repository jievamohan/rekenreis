# Epic 21.2 — QA Strategy

**Source:** docs/design/epic-21.md §7

## Unit Tests

| Target | Assertions |
|--------|------------|
| useMinigameServing | Seed determinism (same seed → same sequence); no-repeat window N=2–3; bag exhaustion/refill |
| useDifficultyProgression | Math ranges per chapter (ch1–3: max 10, ch4–6: max 15, ch7+: max 20); edge cases |
| Mapping validation | All levelIds in map → valid minigameIds; resolution order correct |

## E2E (Deferred)

- Epic 21.2 has no visible minigames; E2E smoke deferred to Epic 21.3+.
- MinigameRenderer fallback path can be unit-tested or manually verified.

## Non-Flaky Assertions

- Deterministic seeds for reproducible sequences
- Prefer data-testid, aria-label for selectors
