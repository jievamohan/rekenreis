# /epicify

Goal: Convert a large feature intent into multiple micro-epics, each runnable via /feature and each bounded to <= 5 tasks.
Micro-epics are numbered as: Epic <N>.<k> (e.g. 18.1, 18.2, 18.3).
Master plan snapshot is: artifacts/archive/epic-<N>.0/latest
Design bible is: docs/design/epic-<N>.md

Usage:
- /epicify <description>                 (default)
- /epicify --epic-id=<N> <description>   (artifact isolation; ARTIFACTS_DIR=artifacts/epicify-<N>)

Protocol:
1) Read docs/epics.md (current state).

2) Determine NEXT_MAJOR_EPIC number N:
- Find the highest Epic number present in docs/epics.md.
- Set N = highest + 1, unless the user explicitly says a specific epic number (e.g. "Use major epic number: 21.").

3) RESET_CURRENT_ARTIFACTS + RUN MANIFEST (hard requirement)
- Set ARTIFACTS_DIR=artifacts/epicify-<N> if --epic-id=<N>; else ARTIFACTS_DIR=artifacts/current.
- Run: ARTIFACTS_DIR="${ARTIFACTS_DIR:-artifacts/current}" scripts/ci/reset_current_artifacts.sh
- Create a run id (UTC timestamp) and write:
  - $ARTIFACTS_DIR/run-id.txt
- Initialize: $ARTIFACTS_DIR/run-manifest.md with:
  - Run id
  - Epic number N
  - Required planning agents list (see below) with placeholders for OK/N/A + artifact path

4) Planning-only discovery (no code changes):
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
- illustrator (only if the intent explicitly requests new assets; otherwise must output N/A)

Write planning artifacts to $ARTIFACTS_DIR:
- $ARTIFACTS_DIR/discovery.md
- $ARTIFACTS_DIR/ux.md
- $ARTIFACTS_DIR/art-direction.md
- $ARTIFACTS_DIR/game-feel.md
- $ARTIFACTS_DIR/motion-audio.md
- $ARTIFACTS_DIR/architecture.md
- $ARTIFACTS_DIR/solution.md
- $ARTIFACTS_DIR/qa.md
- $ARTIFACTS_DIR/security-design.md
- $ARTIFACTS_DIR/assets.md (OK or N/A)
- $ARTIFACTS_DIR/backlog.md

N/A policy (no empty files):
- If a discipline does not apply, the artifact MUST include:
  - "N/A: <reason>"
  - "Impact: none"
  - "Checks still required: <yes/no + short list>"

5) PLANNING_COMPLETENESS_CHECK (hard stop)
- Verify:
  - $ARTIFACTS_DIR/run-id.txt exists
  - $ARTIFACTS_DIR/run-manifest.md exists and includes the same run id
  - Each required artifact file exists
- If any required artifact is missing, mark BLOCKED and stop (no slicing, no epics appended).

6) Create Design Bible (living doc) for this major epic:
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

7) Slice into 3–8 micro-epics:
- Each micro-epic MUST be implementable in <= 5 tasks.
- Each micro-epic MUST have a visible milestone (“what looks/feels different”).
- Order should be safe: tokens/background -> shell/nav -> components -> assets -> motion -> polish.

8) Append micro-epics to docs/epics.md with PlanRef injected:
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

9) Archive the master plan snapshot:
- Run: EPIC_ID="epic-<N>.0" ARTIFACTS_DIR="${ARTIFACTS_DIR:-artifacts/current}" scripts/ci/gh_archive_artifacts.sh
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
- Playwright (including screenshot tests) must run only via docker compose e2e service.