# Solution: Artifact Lifecycle Hardening

## Implementation Approach

1. **Introduce `artifacts/current`**
   - Add `mkdir -p artifacts/current` at start of scripts that need it
   - Replace all `artifacts/` references with `artifacts/current/` in:
     - scripts/ci/gh_pr_bootstrap.sh
     - scripts/ci/gh_watch.sh
     - scripts/ci/gh_fetch_logs.sh
     - .github/workflows/gates.yml (artifacts/zap → artifacts/current/zap)

2. **Orchestrate-task / feature pipeline**
   - Update .cursor/commands/orchestrate-task.md, .cursor/commands/feature.md, .cursor/commands/ci-watch.md, .cursor/commands/ci-fetch-logs.md, .cursor/commands/finalize-feature.md to reference `artifacts/current`
   - Update .cursor/rules (00-agentic-core, 50-ci-watch, etc.) and subagents that mention `artifacts/`

3. **Archive script**
   - Create `scripts/ci/gh_archive_artifacts.sh`:
     - Derive epic-id from branch
     - Timestamp: `date -u +%Y%m%dT%H%M%SZ`
     - `cp -r artifacts/current artifacts/archive/<epic-id>/<timestamp>`
   - Call from `gh_finalize_feature.sh` after CI watch succeeds

4. **.gitignore**
   - Add `artifacts/current/` and `artifacts/archive/` if we want them ignored (optional; current behavior ignores `artifacts/*.md` and `artifacts/zap/`)

## Environment / Config

- Optional: `ARTIFACTS_ROOT` env var for override (default: `artifacts/current`)
- Optional: `EPIC_ID` env var to override branch-derived epic-id

## Rollback

- Revert script changes; restore `artifacts/` paths
- No DB or app code changes; low rollback risk
