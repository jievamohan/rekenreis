---
id: "0043"
title: "mode-selector-tests"
owner: "orchestrator"
status: "done"
scope_in:
  - "Unit tests: modeResolver includes build-bridge"
  - "Unit tests: mode selector persistence (localStorage read/write)"
  - "Unit tests: ModeBuildBridge — place correct/wrong, deterministic with fake events"
  - "Vitest for unit; ensure no flakiness"
scope_out:
  - "E2E smoke (separate task)"
acceptance:
  - "modeResolver('build-bridge') returns 'build-bridge'"
  - "modeResolver('unknown') returns 'classic'"
  - "Selector persistence: mock localStorage, assert write on select"
  - "ModeBuildBridge: simulate place correct → onAnswer called with correct value"
  - "ModeBuildBridge: simulate place wrong → onAnswer called, hint shown"
  - "All unit tests pass"
lanes:
  - name: "T"
    files: ["apps/web/**/*.spec.ts", "apps/web/**/*.test.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Deterministic unit tests for mode contract, selector persistence, and build-bridge logic.
