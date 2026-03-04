# Hardening Epic — QA

## Acceptance Criteria

1. **Policy-as-code**: CI fails if compose/workflows/env violate policy (e.g. hardcoded secret patterns)
2. **Semgrep**: Custom rules for TS + PHP + YAML; semgrep in CI; clean or documented exceptions
3. **Gitleaks**: `.gitleaks.toml` tuned for config files; CI uses it; no regressions
4. **Trivy + Hadolint**: Both run in CI; Dockerfiles pass hadolint; Trivy config scan runs
5. **OWASP ZAP baseline**: ZAP job runs against web+api; reports generated; baseline established
6. **Security regression tests**: Headers, cookies, CORS, API validation tests exist and pass

## Test Strategy

- **Unit/integration**: Security regression tests (T lane)
- **CI**: All new gates must pass on PR
- **Manual**: ZAP baseline review; policy adjustments as needed
