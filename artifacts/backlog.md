# Epic 3 Backlog

## Epic Summary
Add 2 additional skins + simple rewards/unlocks. Local-only; a11y preserved; bundle within budget.

## Scope_in
- 2 new skins reusing Skin contract (SkinRoundProps)
- Simple rewards/unlocks (local-only; minimal UI)
- Tests for unlock logic and skin switching
- a11y stays correct; bundle stays within budget

## Scope_out
- API changes; auth; payments
- Heavy assets; complex animations
- Server-side persistence

## Risks + Mitigations
- perf: New components may add bundle size → verify budget
- privacy: localStorage for unlocks only; no PII

## NFRs
- Perf: bundle budget
- Security: none (local only)
- a11y: keyboard, focus, ARIA

## Task List
1. **0018-two-new-skins** — Add 2 skins (space, pirate) reusing contract [W1, W2]
2. **0019-rewards-unlocks** — Rewards composable + minimal unlock UI [W2, W1]
3. **0020-skin-rewards-tests** — Tests for unlock logic and skin switching [T]
