# Epic 8 — Content Packs per Mode + Pacing Rules: Backlog

## Epic Summary

Introduce content packs per game mode (classic, timed-pop, build-bridge) with pacing rules. Extend level schema with mode applicability and pacing tags. Add pacing engine to avoid clustering hard items back-to-back. Deterministic sequencing per mode via seed.

## Scope In

- Extend Level schema: modeIds (optional), pacingTag (easy/normal/challenge)
- Content packs: levels.classic.v1.json, levels.timed-pop.v1.json, levels.build-bridge.v1.json
- Pacing engine: mix easy/normal/challenge; never two consecutive challenge
- play.vue: load pack by interaction mode
- usePlayGame: apply pacing when source=pack
- Determinism: same seed => same sequence per mode
- Tests: pacing invariants, pack schema validation
- E2E: smoke for all modes with pack

## Scope Out

- Adaptive learning
- Backend content management

## Risks + Mitigations

| Tag | Risk | Mitigation |
|-----|------|------------|
| perf | Bundle size from 3 JSON files | Lazy load or keep packs small (~20–30 levels each) |

## NFRs

- Perf: bundle budget unchanged
- Security: validate all levels on load
- A11y: no change (internal only)

## Task List

| # | Title | Lanes | Gates |
|---|-------|-------|-------|
| 0045 | level-schema-mode-pacing | W2, A2 | C, D, F |
| 0046 | content-packs-per-mode | W2 | C, F |
| 0047 | pacing-engine | W2 | C, D, F |
| 0048 | play-integration-packs | W1, W2 | C, D, F |
| 0049 | tests-pacing-e2e | T | C, D, F |
