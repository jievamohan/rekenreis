# /feature

Input: a single message describing desired functionality.

Usage:
- /feature <description>                 (DEFAULT: FORCE autopilot, bounded)
- /feature --safe <description>          (SAFE mode: enforce Complexity Gate; plan-only if gate fails)
- /feature --plan <description>          (PLAN_ONLY: always stop after backlog + tasks)
- /feature --max-tasks=5 <description>   (override bound; capped by mode)
- /feature --ci                          (require CI success after each executed task before proceeding)

Goal: Run Discovery -> Generate backlog/tasks -> execute Delivery automatically on a SINGLE feature branch with a SINGLE PR.

Defaults:
- MODE: FORCE
- CI: enabled by default (treat as if --ci was provided)
- MAX_TASKS_FORCE: 5
- MAX_TASKS_SAFE: 3
- STOP_ON_BLOCKED: true

Important invariants:
- One feature run = one branch + one PR.
- Do NOT create a new branch per task during /feature delivery. Stack tasks onto the current feature branch.

Protocol:

0) Parse flags
- If --plan: MODE=PLAN_ONLY
- Else if --safe: MODE=SAFE
- Else: MODE=FORCE
- If --max-tasks=N:
  - SAFE: MAX_TASKS = min(N, MAX_TASKS_SAFE)
  - FORCE: MAX_TASKS = min(N, MAX_TASKS_FORCE)
- CI behavior:
  - CI is ON by default; treat as required unless explicitly running PLAN_ONLY.

1) Discovery (no code changes)
Dispatch planning subagents and produce:
- artifacts/discovery.md
- artifacts/ux.md
- artifacts/architecture.md
- artifacts/solution.md
- artifacts/qa.md
- artifacts/security-design.md

2) Backlog synthesis (no code changes)
Create:
- artifacts/backlog.md:
  - Epic summary
  - Scope_in / Scope_out
  - Risks + mitigations (tags: deps/infra/db/auth/security/perf/payments/crypto/data-loss/privacy)
  - NFRs (perf, security, a11y)
  - Task list (each task has: title, lanes, gates, acceptance, scope, risk tags)
Generate concrete tasks:
- tasks/00xx-*.md (contract-first YAML frontmatter + body)

3) Complexity Gate (SAFE only)
SAFE delivery allowed ONLY IF:
- tasks_generated <= 3
- no high-risk tags present (auth/payments/crypto/data-loss/privacy)
- lanes do not include I or D unless explicitly allowed in the feature input
- acceptance criteria are testable and include required tests (unit at minimum)

If SAFE gate fails:
- stop as PLAN_ONLY and output tasks/backlog.

4) FEATURE_BRANCH + PR_BOOTSTRAP (mandatory before delivery, once)
- Ensure you are NOT on main/master; create or reuse a feature branch for this feature run.
- Push the branch to origin.
- Bootstrap a SINGLE PR for this feature branch by running:
  - scripts/ci/gh_pr_bootstrap.sh
- After this step:
  - artifacts/pr-number.txt and artifacts/pr-url.txt MUST exist.

Hard stop:
- If PR cannot be created (auth/permissions or command blocked), stop and report BLOCKED.

5) Delivery execution (FORCE/SAFE only, bounded)
- Select tasks in priority order from artifacts/backlog.md.
- Execute /orchestrate-task for each selected task sequentially, up to MAX_TASKS.

Critical instruction to /orchestrate-task:
- Use the CURRENT branch; do not create a new branch for each task.
- If /orchestrate-task attempts branch creation, it must keep working on the same PR branch (no PR sprawl).

- If CI is ON:
  - require CI success for each executed task before proceeding to next (orchestrator already does CI watch/autofix).

- If any task becomes BLOCKED: stop immediately and summarize.

FORCE safety floor (always enforced):
- no destructive DB operations; prefer reversible changes only
- high-risk areas must be explicitly flagged in task risks + artifacts/risk.md
- keep diffs minimal and reversible

6) Output
- Always output:
  - artifacts/backlog.md location
  - list of generated task files
  - PR number + URL (from artifacts/pr-*.txt)
- If executed:
  - list executed tasks + final status (DONE/BLOCKED)