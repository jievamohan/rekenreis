---
id: "0073"
title: "summary-page-export"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create pages/summary.vue at route /summary"
  - "Display: rounds today, total rounds, accuracy %, favorite mode"
  - "Buttons: Copy summary, Download JSON"
  - "Add nav link to /summary from play.vue and/or settings"
  - "Wire useRoundOutcome.recordRoundOutcome in play.vue onNext (after incrementRound)"
  - "Derive outcome from game.feedback: correct->'correct', !correct->'wrong', timeout->'timeout'"
scope_out:
  - "E2E tests"
acceptance:
  - "Summary page shows correct metrics"
  - "Copy and Download work"
  - "Play rounds update summary after navigation"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/pages/summary.vue", "apps/web/pages/play.vue", "apps/web/pages/settings.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 13 Task 4. Summary page, export UI, play integration for outcome recording.
