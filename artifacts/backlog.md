# Epic 2: Skin System + 1 Skin — Backlog

## Epic summary

Build a minigame skin system: TS contract for rendering a round, core loop stays single source of truth, /play switches skin via query/config (default classic), implement ONE skin (Monster Feed). Tests for skin selection and contract correctness. Keep smoke/e2e green.

## Scope_in / Scope_out

**In**: Skin contract (TS), skin registry, classic skin extraction, Monster Feed skin, useSkin composable, /play skin param, unit tests, smoke updates.
**Out**: Multiple skins beyond one, rewards, persistence, backend.

## Risks + mitigations

| Area   | Risk              | Mitigation                    |
|--------|-------------------|--------------------------------|
| perf   | Bundle size       | Minimal Monster Feed UI; no heavy assets |
| a11y   | Regression        | Preserve ARIA/focus in both skins |

No auth/db/crypto/payments.

## NFRs

- Perf: bundle within budget
- Security: skin id allowlist (no injection)
- a11y: keyboard, focus, ARIA preserved

## Task list

| ID   | Title                         | Lanes | Gates | Acceptance |
|------|-------------------------------|-------|-------|------------|
| 0013 | Skin contract + types         | W2    | C,D,F | SkinRoundProps, SkinDefinition in types/skin.ts |
| 0014 | useSkin composable + registry | W2    | C,D,F | useSkin(id) returns component; invalid → classic |
| 0015 | Extract SkinClassic           | W1    | C,D,F | Current play UI as SkinClassic.vue |
| 0016 | Monster Feed skin             | W1    | C,D,F | SkinMonsterFeed.vue, minimal UI, accessible |
| 0017 | Play page skin wiring + tests | W1,W2,T| C,D,F | /play?skin=, tests, smoke green |
