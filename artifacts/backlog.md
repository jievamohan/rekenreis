# Epic 10 — Child Profiles (Local) + Parent Gate: Backlog

## Epic Summary

Add local child profiles so multiple kids can use the same device. Per-profile progress, rewards, preferences. Parent gate for settings. Large tap targets.

## Scope In

- Profile schema: profiles list, activeProfileId, per-profile progress/prefs
- useProfile composable: create, switch, active profile
- Profile selector UI: list, create, avatar picker
- Parent gate: hold 3s or arithmetic check
- Play integration: use profile data; settings page (difficulty, hints) behind gate
- Migration from single-user to default profile

## Scope Out

- Accounts/login
- Cloud sync
- Rich avatar customization

## Risks + Mitigations

| Tag | Risk | Mitigation |
|-----|------|------------|
| data-loss | Migration drops data | Test migration; preserve legacy until confirmed |

## NFRs

- Perf: bundle budget
- A11y: large tap targets, keyboard support for gate
- Security: parent gate is UX only; document limitation

## Task List

| # | Title | Lanes | Gates |
|---|-------|-------|-------|
| 0055 | profile-schema | W2 | C, D, F |
| 0056 | useProfile-composable | W2 | C, D, F |
| 0057 | profile-selector-ui | W1 | C, D, F |
| 0058 | parent-gate | W1 | C, D, F |
| 0059 | play-integration-profiles | W1, W2 | C, D, F |
