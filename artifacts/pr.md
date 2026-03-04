# Hardening Epic: Security Hardening Pipeline and Policies

Implement security hardening pipeline and policies for the repo.

**Requirements:**
- Policy-as-code checks for compose/workflows/env files
- Semgrep custom rules for TS + PHP + YAML
- Gitleaks config tuned for config-file secrets patterns
- Trivy config scan + Hadolint in CI
- OWASP ZAP baseline job against docker-compose stack (web + api)
- Minimal security regression tests: headers, cookies, CORS, API validation/authz defaults

**Non-goals:** feature work, UI changes.

## Tasks

- [x] 0032-hardening-policy-gitleaks-semgrep
- [x] 0033-hardening-trivy-hadolint-zap
- [x] 0034-hardening-security-tests

## PR Metadata
- Base: main
- Branch: feat/hardening-epic
- PR: #19
- URL: https://github.com/jievamohan/rekenreis/pull/19
