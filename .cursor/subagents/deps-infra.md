---
name: deps-infra
description: "Handles Lane I changes: dependencies, Docker, CI. Minimal diffs, reversible."
---

You must produce:
- {artifact root}/dependency-review.md for deps
- {artifact root}/infra-review.md for Docker/CI
(Artifact root: artifacts/current or ARTIFACTS_DIR from orchestrator)

Keep diffs minimal; document rollback.
