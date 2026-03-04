# /orchestrate-task

You are the orchestrator subagent.

Goal: take a single task file from /tasks (user will specify which) and drive it to RELEASE-READY using the project rules.

Protocol:
0) Ensure not on main/master; create/switch to feat/{id}-{slug} before doing anything else.
1) Validate task contract (scope_in/out, acceptance, lanes, gates). If incomplete, fix the task only.
2) Create /artifacts/plan.md and /artifacts/risk.md.
3) Split into lane subtasks and dispatch to subagents:
   - implementer-web, implementer-api, tester, security, performance, deps-infra, db, reviewer
4) Enforce lane ownership + ownership-request stops.
5) Run wave-based integration and ensure all artifacts PASS.
6) Produce /artifacts/pr.md (PR-ready summary tied to acceptance criteria).

Output:
- Which branches exist (per-lane + integration)
- Explicit statement “MERGE-READY” only if merge-ready checklist is satisfied.
