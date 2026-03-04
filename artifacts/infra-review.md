# Infra Review: 0001-bootstrap-tooling

## Changes

1. **.github/workflows/gates.yml** – New CI workflow
   - Triggers: PR and push to master/main
   - Jobs: gate-c-typecheck, gate-d-security, gate-f-build, lint-test
   - Uses: pnpm/action-setup, actions/setup-node, shivammathur/setup-php, gitleaks-action

2. **docs/runbooks/commands.md** – Canonical command list

3. **apps/ structure** – New apps/web (Nuxt 3) and apps/api (Laravel)

## Reversibility

- Remove `.github/workflows/gates.yml` → CI stops
- Remove `apps/` → full revert
- No persistent infra (no DB, no external services)

## Rollback

```bash
git rm -r apps/ .github/
git checkout -- docs/
```
