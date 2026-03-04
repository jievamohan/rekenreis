# Risk: 0003-vertical-slice-skeleton

## Risk Areas

| Area | Note | Mitigation |
|------|------|------------|
| **infra** | Docker networking + env wiring | Minimal changes; document in runbooks; no secrets in compose |
| **perf** | Keep page lightweight | No heavy deps; simple fetch only |

## High-Risk Changes

- **None** – No auth, crypto, or payment changes.

## Conditional Artifacts

- `artifacts/infra-review.md` – Required (I lane: docker-compose, Dockerfiles, env)
