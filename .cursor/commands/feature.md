# /feature

Input: a single message describing desired functionality.

Usage:
- /feature <description>
- /feature --plan <description>          (PLAN_ONLY)
- /feature --force <description>         (FORCE autopilot even if Complexity Gate fails)
- /feature --max-tasks=5 <description>   (optional override, still bounded)
- /feature --ci                           (optional: require CI success before finishing)

Goal: Run Discovery -> Generate backlog/tasks -> optionally execute Delivery automatically.

Defaults:
- MODE: AUTO
- MAX_TASKS_AUTO: 3
- MAX_TASKS_FORCE: 5
- MAX_CI_FIX_LOOPS: use orchestrator defaults
- STOP_ON_BLOCKED: true

Protocol:

0) Parse flags
- If --plan: MODE=PLAN_ONLY
- If --force: MODE=FORCE
- If --max-tasks=N: set MAX_TASKS (AUTO uses min(N, MAX_TASKS_AUTO), FORCE uses min(N, MAX_TASKS_FORCE))
- If --ci: require CI success for each executed task before proceeding to next

1) Discovery (no code changes)
Dispatch planning subagents and produce:
- business-analyst        -> artifacts/discovery.md (BA section)
- ux-designer            -> artifacts/ux.md
- principal-architect    -> artifacts/architecture.md
- solution-designer      -> artifacts/solution.md
- qa-strategist          -> artifacts/qa.md
- security-privacy       -> artifacts/security-design.md

Planning outputs MUST include:
- assumptions + open questions (minimize; fill reasonable defaults if missing)
- scope_in / scope_out
- risks with tags: deps/infra/db/auth/security/perf/payments/crypto/data-loss/privacy
- acceptance criteria patterns (Given/When/Then)
- test strategy expectations (unit/integration/e2e)
- NFRs (performance, security, accessibility)

2) Backlog synthesis (no code changes)
Create:
- artifacts/backlog.md:
  - Epic summary
  - Scope_in / Scope_out
  - Risks + mitigations
  - NFRs (perf, security, a11y)
  - Task list with: title, lanes, gates, acceptance, scope, risk tags
Generate concrete tasks:
- tasks/00xx-*.md (contract-first YAML frontmatter + body)

3) Complexity Gate (AUTO only)
AUTO delivery allowed ONLY IF:
- tasks_generated <= 3
- no high-risk tags present (auth/payments/crypto/data-loss)
- lanes do not include I or D unless explicitly allowed in the feature input
- acceptance criteria are testable and include required tests

If gate fails:
- MODE=AUTO => stop as PLAN_ONLY and output tasks/backlog
- MODE=FORCE => proceed anyway (bounded) but enforce extra safeguards:
  - do not allow destructive DB operations
  - require explicit risk notes for any I/D/auth changes

4) Delivery execution (AUTO/FORCE only, bounded)
- Select tasks in priority order from artifacts/backlog.md.
- Execute /orchestrate-task for each task, sequentially, up to MAX_TASKS.
- If any task becomes BLOCKED:
  - stop immediately
  - summarize blockers and point to artifacts

5) Output
- Always output:
  - artifacts/backlog.md location
  - list of generated task files
- If executed:
  - list executed tasks + PR(s)
  - final status: DONE or BLOCKED