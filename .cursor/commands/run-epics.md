# /run-epics

Goal: Run all epics from docs/epics.md hands-off:
- execute each epic via /feature
- ensure CI is green and finalize ran
- wait until you (human) merge the PR
- then continue with the next epic

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
   e) Ensure CI is green for the PR:
      - scripts/ci/gh_watch.sh host <PR_NUM>
   f) Enter WAIT MODE until merged:
      - TIMEOUT_SECONDS=600 scripts/ci/gh_wait_pr_merged.sh <PR_NUM>
   g) Once merged: update epic checkbox to `- [x]` in docs/epics.md.
   h) Run BRANCH SYNC again (checkout main, pull); then move on to next epic.

Stop conditions:
- If any epic becomes BLOCKED, stop immediately and summarize blockers.
- Never start the next epic until the previous epic PR is merged.

Output:
- For each epic: PR number + URL + final status (merged/blocked).