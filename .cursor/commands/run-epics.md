# /run-epics

Goal: Run all epics from docs/epics.md hands-off:
- execute each epic via /feature
- ensure CI is green and finalize ran
- wait until you (human) merge the PR
- then continue with the next epic

Protocol (repeat per epic):
1) Read docs/epics.md and split into epics in order.
2) For each epic:
   a) Execute exactly the /feature block shown under that epic (including --ci and --max-tasks).
   b) /feature must:
      - bootstrap a single PR
      - run tasks
      - finalize (squash + CI watch)
   c) Confirm PR exists by reading artifacts/pr-number.txt (or infer via gh).
   d) Ensure CI is green for the PR:
      - scripts/ci/gh_watch.sh host <PR_NUM>
   e) Enter WAIT MODE until merged:
      - scripts/ci/gh_wait_pr_merged.sh <PR_NUM>
   f) Once merged, move on to next epic.

Stop conditions:
- If any epic becomes BLOCKED, stop immediately and summarize blockers.
- Never start the next epic until the previous epic PR is merged.

Output:
- For each epic: PR number + URL + final status (merged/blocked).