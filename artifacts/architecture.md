# Architecture: Artifact Lifecycle Hardening

## Module Boundaries

- **Lane I (infra)**: scripts/ci/*, .github/workflows/gates.yml, .cursor/commands, .cursor/rules
- **No W1/W2, A1/A2, D**: Pure pipeline/infra change

## Data Flow

```
[Feature Run]
    │
    ├─► artifacts/current/     (read/write during run)
    │       ├── pr.md, pr-number.txt, pr-url.txt
    │       ├── plan.md, risk.md, ci-status.md, ...
    │       ├── ci-logs/, zap/
    │       └── ...
    │
    └─► [Finalize Success]
            │
            └─► artifacts/archive/<epic-id>/<timestamp>/
                    (copy of artifacts/current at finalize time)
```

## Key Decisions

1. **artifacts/current as symlink vs real dir**: Use real directory. Symlinks add complexity and can break in CI.
2. **Bootstrap**: On first use, `mkdir -p artifacts/current`; scripts use `ARTIFACTS_ROOT="${ARTIFACTS_ROOT:-artifacts/current}"` or hardcode `artifacts/current`
3. **Archive timing**: After `gh_finalize_feature.sh` completes (CI green), before or as part of finalize script
4. **Epic-id**: Parse from `git branch --show-current` (e.g. `feat/epic16-release-prep` → `epic16`)

## Testing Strategy

- **Unit**: Shell script tests (if available) for path resolution
- **Integration**: Run `gh_pr_bootstrap.sh`, `gh_watch.sh` (mock or dry-run) and verify paths
- **Smoke**: Full `/feature` run on a trivial task to validate end-to-end

## Security

- No new secrets or auth
- Archive may contain CI logs; ensure `.gitignore` excludes `artifacts/archive/` from accidental commit if desired

## Risks

- **Path drift**: If any script is missed, it will write to wrong location → mitigate with grep audit of `artifacts/`
