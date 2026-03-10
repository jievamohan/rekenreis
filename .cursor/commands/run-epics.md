# /run-epics

Goal: Run all epics from docs/epics.md hands-off:
- execute each epic via /feature
- ensure CI is green and finalize ran
- wait until you (human) merge the PR
- then update epics.md via PR (merge commit, no squash), sync main, continue to next epic

Protocol:

0) BRANCH SYNC (at start and before each new epic)
- `git checkout main && git pull origin main`
- Ensures we run each epic from up-to-date main.

1) PREVIEW (before execution)
- Read docs/epics.md and split into epics in order.
- For each epic: check `- [x]` (done) vs `- [ ]` (pending).
- Output summary:
  - List: Epic N — status (done/pending)
  - Next to execute: first epic with `- [ ]`, or "All epics done" if none.
- If docs/epic-progress.md exists: reference it in output.
- Then proceed with step 2.

2) For each epic (starting from first pending):
   a) Skip if epic has `- [x]` (already done).
   b) Execute exactly the /feature block shown under that epic (including --ci and --max-tasks).
   c) /feature must:
      - bootstrap a single PR
      - run tasks
      - finalize (squash + CI watch)
   d) Confirm PR exists by reading artifacts/current/pr-number.txt (or infer via gh).
   e) Ensure CI is green for the PR (tuned for ~4 min CI):
      - SLEEP=20 RETRIES=15 scripts/ci/gh_watch.sh host <PR_NUM>
   f) Enter WAIT MODE until merged:
      - SLEEP=15 TIMEOUT_SECONDS=600 scripts/ci/gh_wait_pr_merged.sh <PR_NUM>
   g) Once merged: run EPICS UPDATE flow (no squash):
      - scripts/ci/gh_epics_update.sh <EPIC_ID> <PR_NUM>
      - EPIC_ID: the epic just merged (e.g. 23.1 or Epic 23.1); PR_NUM: the merged feature PR number.
      - Script: updates epics.md + epic-progress.md, creates branch, pushes, creates PR, merges with --merge (merge commit, no squash), fetches main, checks out main.
   h) After script completes: main is up to date and checked out; move on to next epic.

Stop conditions:
- If any epic becomes BLOCKED, stop immediately and summarize blockers.
- Never start the next epic until the previous epic PR is merged and epics update is complete.

Output:
- For each epic: PR number + URL + final status (merged/blocked).