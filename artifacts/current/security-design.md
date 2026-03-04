# Epic 17 — Graphics v1: Security Design

## Scope

- Frontend-only: assets, Vue components, CSS
- No new API endpoints, auth, or data handling

## Risks

| Area | Risk | Mitigation |
|------|------|------------|
| Assets | Malicious SVG | SVG placeholders from trusted source; no user-uploaded SVGs |
| XSS | Dynamic content in scene | No innerHTML; use Vue bindings only |
| CSP | Inline scripts/styles | Use existing Nuxt/Vue patterns; no eval |

## No Changes to

- Auth, permissions, sessions
- API, database, storage
- Cookies, headers

## Gate D

- Gitleaks, Semgrep, policy-check: no new secrets or patterns
- pnpm audit, composer audit: no new deps (or minimal; audit if added)
