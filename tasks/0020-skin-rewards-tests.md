---
id: "0020"
title: "skin-rewards-tests"
owner: "orchestrator"
status: "done"
scope_in:
  - "Unit tests: useRewards unlock logic (thresholds)"
  - "Unit tests: resolveSkinId for new skin ids"
  - "Integration or e2e: skin switching via ?skin=X"
scope_out:
  - "Full e2e for all flows"
acceptance:
  - "useRewards tests pass"
  - "resolveSkinId/skin resolution tests pass"
  - "Skin switching test (unit or integration)"
  - "All gates PASS"
lanes:
  - name: "T"
    files: ["apps/web/**/*.test.ts", "apps/web/**/*.spec.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 3: Tests for unlock logic and skin switching.
