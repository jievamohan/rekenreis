# /verify-gates

Run and report gates C, D, F.

Requirements:
- Use only commands that are documented in the repository runbooks (if missing, create docs/runbooks/commands.md as the canonical list first).
- Write results to artifact root (ARTIFACTS_DIR, default artifacts/current):
  - typecheck.md, security.md, perf.md, tests.md (if tests run as part of verification)

Fail closed. If any gate cannot run due to missing scripts/config, create a bootstrap tooling task instead of guessing.
