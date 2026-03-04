---
id: "0101"
title: "epic18-smoke-ui-regression"
owner: "orchestrator"
status: "done"
scope_in:
  - "Update docs/runbooks smoke: layout loads, play still works"
  - "Add UI regression assertion: AppShell renders nav tabs and stage"
  - "Ensure /play, /stickers, /summary, /settings, /start all load correctly"
  - "Document manual verification steps if no automated e2e"
scope_out:
  - "Automated Playwright/Cypress (if not already present)"
acceptance:
  - "Smoke verification steps updated in docs/runbooks"
  - "UI regression: nav tabs and stage card documented/asserted"
  - "Existing smoke (play, mode switch, etc.) still passes"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "T"
    files: ["docs/runbooks/*.md", "apps/web/test/*.ts", "apps/web/e2e/*.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 18 Task 5. Smoke and UI regression verification.
