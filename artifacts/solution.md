# Hardening Epic — Solution

## 1. Policy-as-code

Use lightweight checks via `yq` or `opa eval` against Rego policies. Avoid heavy Conftest unless needed.

- **Policies**:
  - docker-compose: no hardcoded prod secrets; ports documented
  - workflows: no inline secrets; use `${{ secrets.* }}`
  - .env.example: no real secrets; placeholder values only
- **Implementation**: `.github/policies/` or `scripts/ci/policy-check.sh` + Rego or shell

## 2. Semgrep

- Create `.semgrep/rules/` with:
  - `ts-security.yaml`: TS rules (e.g. eval, dangerous patterns)
  - `php-security.yaml`: PHP rules (e.g. sql injection, command injection)
  - `yaml-policy.yaml`: YAML rules for workflows/compose
- Config: `semgrep --config .semgrep` or extend `auto`

## 3. Gitleaks

- `.gitleaks.toml` at repo root
- `[extend] useDefault = true`
- Custom rules for: env vars, compose `environment`, workflow env
- Allowlist: `base64:0000...`, `secret`, `root` in example files

## 4. Trivy + Hadolint

- **Hadolint**: `hadolint apps/web/Dockerfile apps/api/Dockerfile`
- **Trivy**: `trivy config .` for IaC; `trivy image` for built images (optional, heavier)
- CI: New job `gate-d-container` or extend `gate-d-security`

## 5. OWASP ZAP Baseline

- Job: `docker compose up -d`; wait for `/health`; run `zap-baseline.py -t http://localhost:3000` and `http://localhost:8001`
- Use `ghcr.io/zaproxy/zaproxy:stable`; `-I` for warnings-only initially
- Mount config to tune rules (FAIL vs IGNORE)

## 6. Security Regression Tests

- **Web (Vitest + fetch/axios)**:
  - GET `/` or `/start` → assert headers (X-Frame-Options or equivalent)
  - Cookie attributes if any
- **API (PHPUnit)**:
  - CORS preflight / headers
  - Validation on `/session-stats` (invalid payload → 422)
  - Health returns 200
- **Nuxt**: Add minimal security headers in `nuxt.config.ts` (e.g. `headers` in routeRules)
- **Laravel**: CORS config in `config/cors.php` if missing
