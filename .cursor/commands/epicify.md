# /epicify

Goal: Convert a large feature intent into multiple micro-epics, each runnable via /feature and each bounded to <= 5 tasks.
Micro-epics are numbered as: Epic <N>.<k> (e.g. 18.1, 18.2, 18.3).
Master plan snapshot is: artifacts/archive/epic-<N>.0/latest
Design bible is: docs/design/epic-<N>.md

Protocol:
1) Read docs/epics.md (current state).

2) Determine NEXT_MAJOR_EPIC number N:
- Find the highest Epic number present in docs/epics.md.
- Set N = highest + 1, unless the user explicitly says a specific epic number.

3) Planning-only discovery (no code changes):
Dispatch planning subagents:
- business-analyst
- ux-designer
- art-director
- game-designer
- motion-audio-designer
- principal-architect
- solution-designer
- qa-strategist
- security-privacy
- illustrator (only if the intent explicitly requests new assets)

Write planning artifacts to artifacts/current:
- artifacts/current/discovery.md
- artifacts/current/ux.md
- artifacts/current/art-direction.md
- artifacts/current/game-feel.md
- artifacts/current/motion-audio.md
- artifacts/current/architecture.md (only if needed)
- artifacts/current/solution.md (only if needed)
- artifacts/current/qa.md
- artifacts/current/security-design.md
- artifacts/current/backlog.md

4) Create Design Bible (living doc) for this major epic:
- Create docs/design/epic-<N>.md using docs/design/_epic-template.md
- Fill the chapters using the planning artifacts:
  - BA + Game Designer -> Chapter 1
  - Art Director -> Chapter 2
  - UX -> Chapters 3 + (part of 5)
  - Motion -> Chapter 4
  - Architect + Solution -> Chapter 6
  - QA -> Chapter 7
  - Security/Privacy -> Chapter 8
  - Orchestrator -> Chapter 9 (Slice Map)

5) Slice into 3–8 micro-epics:
- Each micro-epic MUST be implementable in <= 5 tasks.
- Each micro-epic MUST have a visible milestone (“what looks/feels different”).
- Order should be safe: tokens/background -> shell/nav -> components -> assets -> motion -> polish.

6) Append micro-epics to docs/epics.md with PlanRef injected:
For k=1..m, append:

## Epic <N>.<k> — <Title>
- [ ]
PlanRef:
- design: docs/design/epic-<N>.md
- archive: artifacts/archive/epic-<N>.0/latest
- slice: <N>.<k>
Rules:
- Use PlanRef as source of truth.
- Do NOT regenerate planning unless a referenced PlanRef file is missing.

Then include a /feature block (explicit prompt) and acceptance criteria.

7) Archive the master plan snapshot:
- Run: scripts/ci/archive_current_artifacts.sh "<N>.0"
- Commit:
  - docs/epics.md
  - docs/design/epic-<N>.md
  - artifacts/archive/epic-<N>.0/
- Commit message:
  - "chore(epicify): add epic <N> micro-epics and archive plan <N>.0"
- Push.

Constraints:
- Plan-only: do not modify app code.
- Do not mark any epic as [x].
- Never execute /feature here.
-	“Playwright (including screenshot tests) must run only via docker compose e2e service.”