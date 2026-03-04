# Epic 12 — Rewards Expansion: Security Design

## Scope

- Local storage only; no new API
- Date handling: client-side only; no server trust

## Risks

- **Low**: No auth, payments, or sensitive data
- Date manipulation: user could change device date; acceptable for local-only reward
