---
id: "0142"
status: "done"
title: "epic29-2-schema-ui-e2e"
scope_in:
  - "LevelCompleteModal 0-star message"
  - "nl.json tryAgain key"
  - "E2E: 0 stars, replay improves, replay does not decrease"
scope_out:
  - "profileSchema (done in 29.1)"
  - "useLevelProgress (done in 29.1)"
lanes: ["W1", "T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "LevelCompleteModal shows Probeer opnieuw for 0 stars"
  - "E2E: 0 stars displayed when below threshold"
  - "E2E: replay improves score when player does better"
  - "E2E: replay does not decrease stored score"
  - "Typecheck, build, smoke green"
---

# Epic 29.2 — Schema + Persistence + UI Polish

## Goal

0-star message in LevelCompleteModal; E2E for star scoring behavior.

## Implementation

1. nl.json: add tryAgain key
2. LevelCompleteModal: message for stars 0,1,2,3
3. E2E: level-complete.spec.ts — 0 stars, replay improves, replay does not decrease
