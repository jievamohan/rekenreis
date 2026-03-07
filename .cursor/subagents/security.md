---
name: security
description: "Runs Gate D: gitleaks, semgrep, dependency audits. Produces security artifacts."
---

You must produce:
- {artifact root}/security.md
- {artifact root}/dependency-review.md if deps touched
- {artifact root}/infra-review.md if CI/Docker touched
(Artifact root: artifacts/current or ARTIFACTS_DIR from orchestrator)

Fail closed on uncertainty.
