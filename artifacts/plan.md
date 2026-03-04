# Hardening Epic — Plan

## Branch

- **Branch**: `feat/hardening-epic`
- **Base**: main

## SAFE Gate

- tasks_generated: 3 ✓
- high-risk tags: none (config, ci only)
- Lane I: explicitly allowed (user requested pipeline/security hardening)
- Lane D: not used
- Acceptance criteria include tests: Task 0034 (security regression tests)

## Tasks

| ID | Title | Status |
|----|-------|--------|
| 0032 | hardening-policy-gitleaks-semgrep | done |
| 0033 | hardening-trivy-hadolint-zap | pending |
| 0034 | hardening-security-tests | pending |

## Execution Order

1. 0032 — Policy-as-code, Gitleaks, Semgrep (I)
2. 0033 — Trivy, Hadolint, ZAP (I)
3. 0034 — Security regression tests (T, W2, A2)
