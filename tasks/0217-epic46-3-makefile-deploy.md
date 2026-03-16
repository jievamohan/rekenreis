---
id: 0217-epic46-3-makefile-deploy
title: Epic 46.3 — Makefile Deploy Scripts
scope_in:
  - Makefile targets: build, deploy, deploy-pull, deploy-rsync
  - deploy-pull: SSH, git pull, composer install, cache clear
  - deploy-rsync: rsync public + vendor naar VPS
  - No secrets in Makefile; env vars
  - Runbook in docs/runbooks/
scope_out:
  - Prod config (46.4)
lanes: [I]
file_globs:
  - Makefile
  - scripts/**/*.sh
  - docs/runbooks/*.md
gates: [C, D, F]
risk_tags: [infra]
acceptance:
  - make build works
  - make deploy-pull (or deploy-rsync) documented and executable with correct env
  - Runbook describes TransIP/DirectAdmin steps
status: pending
---

# Epic 46.3 — Makefile Deploy Scripts

Add Makefile targets for TransIP VPS + DirectAdmin deployment.
Use env vars (e.g. DEPLOY_HOST, DEPLOY_PATH); never hardcode secrets.
