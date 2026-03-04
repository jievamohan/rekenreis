# /feature

Input: a single message describing desired functionality.

Usage:
- /feature <description>                 (DEFAULT: FORCE autopilot, bounded)
- /feature --safe <description>          (SAFE mode: enforce Complexity Gate; plan-only if gate fails)
- /feature --plan <description>          (PLAN_ONLY: always stop after backlog + tasks)
- /feature --max-tasks=5 <description>   (override bound; capped by mode)
- /feature --ci                          (require CI success after each executed task before proceeding)

Goal: Run Discovery -> Generate backlog/tasks -> optionally execute Delivery automatically.

Defaults:
- MODE: FORCE
- MAX_TASKS_FORCE: 5
- MAX_TASKS_SAFE: 3
- STOP_ON_BLOCKED: true
- MAX_CI_FIX_LOOPS: orchestrator defaults

Protocol:

0) Parse flags
- If --plan: MODE=PLAN_ONLY
- Else if --safe: MODE=SAFE
- Else: MODE=FORCE
- If --max-tasks=N:
  - SAFE: MAX_TASKS = min(N, MAX_TASKS_SAFE)
  - FORCE: MAX_TASKS = min(N, MAX_TASKS_FORCE)
- If --ci: require CI success for each executed task before proceeding to next

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

4) Delivery execution (FORCE/SAFE only, bounded)
- Select tasks in priority order from artifacts/backlog.md.
- Execute /orchestrate-task for each task sequentially, up to MAX_TASKS.
- If any task becomes BLOCKED: stop immediately and summarize.

FORCE safety floor (still enforced):
- no destructive DB operations; prefer reversible changes only
- high-risk areas must be explicitly flagged in task risks + artifacts/risk.md
- keep diffs minimal and reversible

5) Output
- Always output:
  - artifacts/backlog.md location
  - list of generated task files
- If executed:
  - list executed tasks + PR(s)
  - final status: DONE or BLOCKED