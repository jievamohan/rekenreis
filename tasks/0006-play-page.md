---
id: "0006"
title: "play-page"
owner: "orchestrator"
status: "ready"
scope_in:
  - "/play route with minimal UI: question, 3-4 answer buttons, score, streak"
  - "Immediate feedback (correct/incorrect), next-question progression"
  - "Keyboard navigation and focus (a11y)"
  - "Mode selection or default (up to 10 / up to 20)"
scope_out:
  - "Minigame skins or thematic layers"
  - "Backend persistence"
acceptance:
  - "/play renders and is playable"
  - "Question displayed; selecting answer shows feedback, then next question"
  - "Score and streak update correctly"
  - "Keyboard: Tab to choices, Enter/Space to select; focus visible"
  - "Gate C, D, F pass; existing tests green"
lanes:
  - name: "W1"
    files: ["apps/web/pages/**", "apps/web/components/**"]
  - name: "W2"
    files: ["apps/web/composables/**"]
  - name: "T"
    files: ["apps/web/test/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Main game screen. Uses usePlayGame from task 0005. Must be accessible.

## Dependencies

- Requires task 0005 (composable) complete.
