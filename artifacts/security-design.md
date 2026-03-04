# Hardening Epic — Security Design

## Objectives

- Shift-left: catch misconfig and secrets early
- Container hygiene: Hadolint + Trivy
- DAST baseline: ZAP against running stack
- Regression coverage: headers, CORS, validation defaults

## Threat Model (Minimal)

- **Secrets in config**: Mitigated by gitleaks + policy-as-code
- **Vulnerable images**: Mitigated by Trivy
- **Weak Dockerfiles**: Mitigated by Hadolint
- **Web/API misconfig**: Mitigated by ZAP baseline + regression tests

## Risk Tags

- **config**: Policy and tool config changes (low)
- **ci**: New CI jobs (low; may increase build time)
- **auth**: Not in scope; authz tests only validate defaults (no auth implementation)

## Mitigations

- Gitleaks allowlists for known placeholders
- Semgrep: document and approve any required ignores
- ZAP: use baseline mode (no active scanning in CI initially)
