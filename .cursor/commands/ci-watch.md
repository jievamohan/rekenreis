# /ci-watch

Run bounded CI polling and write artifacts.

Usage:
- Prefer host mode:
  - scripts/ci/gh_watch.sh host <PR_NUMBER>
- Or container mode:
  - scripts/ci/gh_watch.sh container <PR_NUMBER>

Protocol:
1) Run gh_watch (host). If host auth is not available, fallback to container.
2) Use exit code: 0 = success, 1 = failed, 3 = pending timeout.
3) If CI failed (exit code 1), immediately run /ci-fetch-logs.
4) If CI pending timeout (exit code 3), mark task BLOCKED.