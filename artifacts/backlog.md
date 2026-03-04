# Hardening Epic — Backlog

## Generated Tasks (condensed for --safe, ≤3)

| Task | File | Lanes |
|------|------|-------|
| 0032 | tasks/0032-hardening-policy-gitleaks-semgrep.md | I |
| 0033 | tasks/0033-hardening-trivy-hadolint-zap.md | I |
| 0034 | tasks/0034-hardening-security-tests.md | T, W2, A2 |

### Task 0032: Policy-as-code + Gitleaks + Semgrep

- Policy-as-code checks for compose/workflows/env
- `.gitleaks.toml` tuned for config-file secrets
- Semgrep custom rules (TS, PHP, YAML) and CI wiring

### Task 0033: Trivy + Hadolint + ZAP Baseline

- Hadolint in CI for Dockerfiles
- Trivy config scan
- OWASP ZAP baseline job vs docker-compose stack

### Task 0034: Security Regression Tests

- Headers, cookies, CORS, API validation regression tests
- Minimal Nuxt/Laravel wiring if needed

## Out of Scope (future)

- Full auth implementation
- Production hardening
- Full pentest
