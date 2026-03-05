# Epic 21.2 — Security Design

**Source:** docs/design/epic-21.md §8

## N/A: Client-Side Only

- **Scope:** Types, composables, MinigameRenderer, static JSON content
- **No new API endpoints**
- **No auth/crypto/payments**
- **No new data collection**

## Config Constraints

- Static JSON content files (minigame-map.v1.json); no eval, no dynamic scripts

## Verdict

Standard Gate D checks (gitleaks, semgrep) sufficient. No additional security artifacts required.
