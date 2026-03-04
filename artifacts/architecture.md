# Hardening Epic — Architecture

## Context

Repo layout: `/apps/web` (Nuxt), `/apps/api` (Laravel), `/packages`. CI in `.github/workflows/gates.yml`.

## Additions

### 1. Policy-as-code

- **Target files**: `docker-compose.yml`, `.github/workflows/*.yml`, `*.env.example`, `**/.env.example`
- **Mechanism**: OPA/Conftest or custom YAML/TOML checks (e.g. shell + yq)
- **Placement**: New CI job or step in Gate D

### 2. Semgrep

- **Location**: `.semgrep/` or repo root `.semgreprules.yml`
- **Rules**: TS (apps/web), PHP (apps/api), YAML (workflows, compose)
- **CI**: Add `semgrep scan --config auto` (or custom config) to Gate D

### 3. Gitleaks

- **Location**: `.gitleaks.toml` at repo root
- **Tuning**: config-file patterns (env, compose, yaml) with allowlists for known placeholders (e.g. base64 zeros, `secret`, `root`)

### 4. Trivy + Hadolint

- **Trivy**: Scan Dockerfiles and built images (config + vuln); CI job
- **Hadolint**: Lint Dockerfiles; CI step before build

### 5. OWASP ZAP Baseline

- **Flow**: `docker compose up -d` → wait for health → `zap-baseline.py -t http://web:3000` and `-t http://api:8001`
- **Placement**: Separate job (or optional scheduled); may run in same workflow with services

### 6. Security Regression Tests

- **Web**: Headers (X-Frame-Options, CSP-like), cookies (httpOnly, secure when applicable)
- **API**: CORS, validation, authz defaults (e.g. unauthenticated endpoints documented)
- **Lanes**: T (tests), minimal W2/A2 for wiring

## Lanes

- **I**: CI workflows, config files (.gitleaks.toml, .semgrep, policy checks)
- **T**: Security regression tests
- **W2/A2**: Minimal wiring (e.g. Nuxt headers, Laravel CORS config) only if tests require it
