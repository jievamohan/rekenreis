# /verify-gates

Run and report gates C, D, F.

Requirements:
- Use only commands that are documented in the repository runbooks (if missing, create docs/runbooks/commands.md as the canonical list first).
- Write results to:
  - /artifacts/typecheck.md
  - /artifacts/security.md
  - /artifacts/perf.md
  - /artifacts/tests.md (if tests run as part of verification)

Fail closed. If any gate cannot run due to missing scripts/config, create a bootstrap tooling task instead of guessing.
