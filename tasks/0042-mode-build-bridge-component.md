---
id: "0042"
title: "mode-build-bridge-component"
owner: "orchestrator"
status: "done"
scope_in:
  - "Implement ModeBuildBridge.vue: bridge visual, draggable planks (answer choices), drop slot"
  - "Drag-and-drop: native HTML5 or minimal lib"
  - "Keyboard alternative: focus plank, focus slot, place via Enter/Space or click"
  - "Friendly feedback; gentle hint on wrong; no fail state"
  - "Reuse usePlayGame: onAnswer, onNext; same feedback types"
scope_out:
  - "Mode selector (separate task)"
  - "Content packs per mode (Epic 8)"
acceptance:
  - "Build-bridge renders question, planks, drop zone"
  - "Drag correct plank → onAnswer(correct); feedback; next"
  - "Wrong plank: onAnswer(wrong); gentle hint; retry allowed"
  - "Keyboard: select plank + place without mouse"
  - "Bundle within budget"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/components/modes/ModeBuildBridge.vue"]
  - name: "W2"
    files: ["apps/web/utils/*.ts"]
gates: ["C", "D", "F"]
risks:
  - area: "a11y"
    note: "Keyboard path must work; test manually"
  - area: "perf"
    note: "Prefer native drag; avoid heavy deps"
---

## Context

Build-bridge mode: drag correct answer plank into gap. Kid-friendly, no punitive feedback.
