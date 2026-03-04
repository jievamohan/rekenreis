# Hardening Epic Discovery

## Summary

Implement security hardening pipeline and policies for the repo: policy-as-code, SAST customization, secrets config, container scanning (Trivy + Hadolint), OWASP ZAP baseline, and minimal security regression tests.

## Current State

- **Gate D (Security)**: gitleaks (default config), pnpm audit, composer audit
- **No semgrep** in CI (runbooks reference `semgrep scan --config auto`, not wired)
- **No .gitleaks.toml** — CI uses default; logs show "no gitleaks config found"
- **No Trivy** or **Hadolint** in CI
- **No OWASP ZAP** or DAST
- **No policy-as-code** checks for compose/workflows/env files
- **Docker Compose stack**: web (Nuxt) on 3000, api (Laravel) on 8001, mysql internal
- **API**: `/health`, `/session-stats` (POST); no auth; session driver array

## Requirements (In Scope)

1. **Policy-as-code**: checks for compose/workflows/env files (e.g. Conftest, OPA, or custom checks)
2. **Semgrep**: custom rules for TS + PHP + YAML policies
3. **Gitleaks**: config tuned for config-file secrets patterns
4. **Trivy**: config scan + Hadolint in CI
5. **OWASP ZAP baseline**: job against docker-compose stack (web + api)
6. **Minimal security regression tests**: headers, cookies, CORS, API validation/authz defaults

## Non-Goals

- Feature work
- UI changes

## Scope

- **In**: Policy-as-code, semgrep rules, gitleaks config, Trivy+Hadolint CI, ZAP baseline job, security regression tests
- **Out**: Auth implementation, production hardening, full pentest
