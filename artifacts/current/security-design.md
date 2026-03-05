# Epic 21.3 — Security Design

**Source:** docs/design/epic-21.md

## N/A: Client-Side Only

- No new API endpoints
- No new data collection or identifiers
- No auth, crypto, or payment changes
- Static JSON content; no eval, no dynamic scripts

## Impact

None. Standard Gate D checks (gitleaks, semgrep, dependency audits) sufficient.

## Checks Required

- gitleaks clean
- semgrep auto clean (or documented)
- pnpm audit --prod clean
