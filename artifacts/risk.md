# Risk: 0001-bootstrap-tooling

## Risk Assessment

| Area | Risk Level | Notes |
|------|------------|-------|
| auth/permissions | None | No auth logic |
| crypto/payments | None | No crypto/payment logic |
| deps | Low | Adding standard tooling deps (eslint, vue-tsc, phpstan, etc.) |
| infra/CI | Low | New CI workflow; reversible |
| db | None | No migrations |

## Mitigations

- **Deps**: All new deps are dev-only (lint, typecheck, test tooling). Producing artifacts/dependency-review.md if composer/npm deps change.
- **CI**: Workflow is additive; can be disabled by removing file. artifacts/infra-review.md for CI changes.
- **Reversibility**: Entire apps/ can be removed; CI can be reverted. No persistent state.

## Policy Compliance

- No auth/crypto/payment changes → no special flag
- Deps changes → dependency-review.md (will produce)
- CI changes → infra-review.md (will produce)
- No db changes → no db-review.md
