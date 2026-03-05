# Epic 21.5 QA

**Unit tests:**
- SubmarineSort: renders, drag/select submits answer, keyboard fallback
- StarfishMatch: renders, tap pair submits answer, timer behavior
- Map validation: submarine-sort, starfish-match resolve in serving

**E2E (docker compose run --rm e2e):**
- Smoke: both minigames render, interaction works, answer submits
- Flow: play session cycles through all 6 minigames
- Reduced motion: animations collapse

**Non-flaky:** data-testid, deterministic seeds, aria-label selectors.
