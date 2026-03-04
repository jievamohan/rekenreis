---
name: security
description: "Runs Gate D: gitleaks, semgrep, dependency audits. Produces security artifacts."
---

You must produce:
- artifacts/security.md
- artifacts/dependency-review.md if deps touched
- artifacts/infra-review.md if CI/Docker touched

Fail closed on uncertainty.
