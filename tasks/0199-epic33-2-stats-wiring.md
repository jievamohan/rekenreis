---
id: "0199"
title: "epic33-2-stats-wiring"
status: "in_progress"
scope_in:
  - "apps/web/pages/play.vue"
  - "apps/web/components/modals/LevelCompleteModal.vue"
scope_out:
  - "apps/api"
lanes: ["W1", "W2"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "Level timer: MM:SS in footer"
  - "Combo max in footer"
  - "XP (sterren*40 + combo bonus) in footer"
  - "Score % in footer"
  - "Typecheck, build, E2E green"
---

# Epic 33.2 — Result Modal: Stats (Score, Tijd, Combo, XP)

## Goal

Wire level timer, max combo, XP formula; pass real values to LevelCompleteModal footer stats.
