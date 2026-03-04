# Security

## Gate D (Security)

- Policy check: PASS (scripts/ci/policy-check.sh)
- Gitleaks: uses .gitleaks.toml
- Semgrep: auto + .semgrep custom rules
- Hadolint: Dockerfiles
- Trivy: config scan
- ZAP baseline: web + api (separate job)
