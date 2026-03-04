# CI Speed Optimization: Backlog

## scope_in

- **Docker build cache (zap-baseline)**
  - setup-buildx-action
  - Build web + api met build-push-action (load: true, cache-from/to: type=gha)
  - docker compose up --no-build
- **Pip cache (gate-d)**
  - Cache pip packages voor semgrep
- **Documentatie**
  - docs/runbooks: cache-strategie bijwerken

## scope_out

- CI job restructuring
- ZAP job verwijderen
- Registry push (images blijven lokaal)

## Risks

| Tag | Risk | Mitigation |
|-----|------|------------|
| ci | Cache key mismatch → stale build | Key op hash(Dockerfile, lockfiles) |
| ci | GHA cache size limit | mode=max; scope per service |

## Task List (max 5)

| ID | Title | Lane | Description |
|----|-------|------|--------------|
| 0085 | docker-buildx-cache-zap | I | Buildx + GHA cache voor web/api in zap-baseline |
| 0086 | pip-cache-gate-d | I | Pip cache voor semgrep in gate-d |
| 0087 | docs-runbooks-ci-cache | I | Documenteer cache-strategie in runbooks |
