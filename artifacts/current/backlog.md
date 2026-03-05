# Backlog: Fix Failing Playwright Tests

## Epic Summary
Fix 4 failing Playwright tests in CI caused by a missing page title and missing visual regression baseline snapshots.

## Scope_in
- Add default `<title>` to Nuxt app config
- Generate and commit visual regression baseline PNGs for the e2e container environment

## Scope_out
- Any game logic changes
- New tests beyond fixing existing failures
- CI workflow modifications
- Dependency updates

## Risks + Mitigations
- **Risk**: Visual snapshots generated locally may differ from CI environment → **Mitigation**: Generate inside the same Docker image used by CI (`mcr.microsoft.com/playwright:v1.49.0-jammy`)
- No high-risk tags (auth/payments/crypto/data-loss/privacy)

## NFRs
- Perf: no impact (title tag is negligible)
- Security: no impact
- A11y: title tag improves screen reader experience (positive)

## Task List

| # | Task | Lanes | Gates | Risk |
|---|------|-------|-------|------|
| 0117 | fix-playwright-title-and-snapshots | W1, T | C, F | none |
