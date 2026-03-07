# Parallel Epic Execution

Run multiple agents on different epics simultaneously using artifact isolation and Git worktrees.

## Overview

By default, `/feature` and `/run-epics` use a single shared `artifacts/current` directory and one Git working tree. To run multiple agents in parallel:

1. **Artifact isolation**: Each epic uses `artifacts/epic-<N>.<k>` via `--epic-id=<N>.<k>`
2. **Workspace isolation**: Each epic runs in its own Git worktree (separate directory, shared `.git`)

## Which Epics Can Run in Parallel?

- **Micro-epics within one major epic** (e.g. 19.1, 19.2): Usually sequential — 19.2 depends on 19.1. Do not run in parallel unless they touch clearly different files.
- **Different major epics** (e.g. 19.x vs 20.x): Can run in parallel if they touch different files. Check lane overlap before running.
- **Recommendation**: Only run epics with clear lane separation in parallel (e.g. 19.3 assets vs 19.4 pages).

## Steps

### 1. Create worktrees for each epic

From the main repo (on `main`):

```bash
# Create worktree for Epic 19.1
scripts/ci/gh_worktree_epic.sh 19.1

# Create worktree for Epic 19.2 (or another epic)
scripts/ci/gh_worktree_epic.sh 19.2
```

Each command creates a directory like `../rekenreis-epic-19-1` with a branch `feat/epic-19.1-parallel`.

### 2. Open each worktree in a separate Cursor window

- **Window 1**: File > Open Folder > `../rekenreis-epic-19-1`
- **Window 2**: File > Open Folder > `../rekenreis-epic-19-2`

### 3. Run /feature in each window with --epic-id

In each Cursor window, run the `/feature` block from `docs/epics.md` for that epic, including `--epic-id`:

```
/feature --epic-id=19.1 --ci --max-tasks=5
Build Epic 19.1: Replace white app look with underwater design tokens.
...
```

```
/feature --epic-id=19.2 --ci --max-tasks=5
Build Epic 19.2: New app shell and nav tabs...
...
```

Each agent writes to its own `artifacts/epic-19.1` or `artifacts/epic-19.2` directory.

### 4. Merge PRs in dependency order

- Merge PRs in the correct order (e.g. 19.1 before 19.2).
- After each merge: in other worktrees, run `git pull origin main` and rebase if needed.

### 5. Clean up worktrees when done

```bash
# From main repo
git worktree remove ../rekenreis-epic-19-1
git worktree remove ../rekenreis-epic-19-2

# Or if worktree has uncommitted changes:
git worktree remove ../rekenreis-epic-19-1 --force
```

## Scripts and environment

| Script | ARTIFACTS_DIR support |
|--------|------------------------|
| `reset_current_artifacts.sh` | Yes |
| `gh_pr_bootstrap.sh` | Yes |
| `gh_watch.sh` | Yes |
| `gh_fetch_logs.sh` | Yes |
| `gh_archive_artifacts.sh` | Yes |

When running scripts from an epic worktree, set `ARTIFACTS_DIR`:

```bash
ARTIFACTS_DIR=artifacts/epic-19.1 scripts/ci/gh_watch.sh host <PR_NUM>
```

## Limitations

- **Cursor**: No automatic "spawn N agents" — you open N Cursor windows manually.
- **Merge conflicts**: If epics touch overlapping files, resolve conflicts when merging. Merge in dependency order.
- **CI**: Each epic has its own PR; CI runs independently per PR.
