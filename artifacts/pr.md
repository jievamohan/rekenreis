# Epic 8 — Content Packs per Mode + Pacing Rules

Introduce content packs per game mode (classic, timed-pop, build-bridge) with pacing rules to keep sessions varied and frustration-free.

**Requirements:**
- Extend level schema: modeId applicability, pacing tags (easy/normal/challenge)
- Content packs: levels.classic.v1.json, levels.timed-pop.v1.json, levels.build-bridge.v1.json
- Pacing engine: mix easy/normal/challenge; never cluster hard back-to-back
- Determinism: same seed => same sequence per mode
- Tests: pacing invariants, pack schema validation
- E2E: verify pack mode works for all modes

## Tasks

- [ ] 0045-level-schema-mode-pacing
- [ ] 0046-content-packs-per-mode
- [ ] 0047-pacing-engine
- [ ] 0048-play-integration-packs
- [ ] 0049-tests-pacing-e2e
