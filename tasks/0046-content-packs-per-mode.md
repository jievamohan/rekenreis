---
id: "0046"
title: "content-packs-per-mode"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create levels.classic.v1.json, levels.timed-pop.v1.json, levels.build-bridge.v1.json in apps/web/content/"
  - "Each pack contains Level[] with pacingTag (easy/normal/challenge)"
  - "Split or derive from existing levels.v1.json"
scope_out:
  - "Pacing engine, play integration"
acceptance:
  - "Three JSON files exist and parse as Level[]"
  - "All levels validate via levelValidator"
  - "Each pack has mix of easy/normal/challenge"
  - "Bundle size within budget"
lanes:
  - name: "W2"
    files: ["apps/web/content/*.json"]
gates: ["C", "D", "F"]
risks:
  - area: "perf"
    note: "Keep packs small (~25-30 levels each)"
---

## Context

Epic 8 Task 2. Provide mode-specific content packs.
