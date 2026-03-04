# Epic 1: Level Contract + Content Pack — Security Design

## Attack surface

- **Content pack**: Static file; not user-uploaded. Low risk.
- **Query param**: `mode` is read-only; no injection into level generation.
- **Validator**: Validates structure only; no eval or dynamic code.

## Secrets

- None. No API keys, no auth.

## Auth implications

- None. Game remains unauthenticated.

## SAST / dependency audit

- Gate D: gitleaks, semgrep, pnpm audit, composer audit—unchanged.
