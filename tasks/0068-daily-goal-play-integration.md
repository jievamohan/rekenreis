---
id: "0068"
title: "daily-goal-play-integration"
owner: "orchestrator"
status: "done"
scope_in:
  - "Wire useDailyGoal into play.vue"
  - "Call incrementRound when round completes (on nextQuestion after feedback)"
  - "Daily goal widget: show rounds/goal (e.g. 3/5 rounds today)"
  - "Celebrate when goal reached (playCelebrate)"
scope_out:
  - "Sticker book"
acceptance:
  - "Round completion increments daily rounds"
  - "Widget shows current progress"
  - "Goal reached triggers celebration"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/pages/play.vue"]
  - name: "W2"
    files: ["apps/web/composables/useDailyGoal.ts"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 12 Task 4. Daily goal integration in play flow.
