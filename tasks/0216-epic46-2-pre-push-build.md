---
id: 0216-epic46-2-pre-push-build
title: Epic 46.2 — Pre-push Build Verification
scope_in:
  - Pre-push hook: run make build, verify apps/api/public/_nuxt/ and index.html exist
  - Fail with clear instruction if build fails or artifacts missing
  - Document how to keep artifacts up to date
  - Gate C, D, F green
scope_out:
  - Deploy scripts (46.3)
  - Prod config (46.4)
lanes: [I]
file_globs:
  - .githooks/**
  - Makefile
  - scripts/**/*.sh
  - docs/runbooks/*.md
gates: [C, D, F]
risk_tags: [infra]
acceptance:
  - Pre-push runs build; fails if build fails or artifacts missing
  - Documentatie: hoe artifacts up-to-date te houden
status: done
---

# Epic 46.2 — Build Automation + Pre-push

Pre-push hook verifies build succeeds and artifacts exist. Build artifacts are not committed; document strategy.
