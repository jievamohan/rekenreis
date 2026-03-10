---
id: "0155"
title: "epic32-1-shell-collector-core"
status: "pending"
scope_in:
  - "apps/web/components/minigames/MinigameShellCollector.vue"
  - "apps/web/assets/graphics/minigames/shell-collector/"
  - "apps/web/test/"
scope_out:
  - "apps/api"
  - "useMinigame.ts (Epic 32.2)"
  - "minigame-map.v1.json (Epic 32.2)"
  - "play.vue (Epic 32.2)"
  - "MinigameSubmarineSort.vue (Epic 32.2)"
lanes: ["W1", "T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "Shell Collector renders; tap adds shells; correct emits answer"
  - "No ProblemCard in component (math embedded in scene)"
  - "Keyboard parity with pointer"
  - "Overtap: gentle feedback (shake)"
  - "SVG assets in shell-collector/ (creature, shell)"
  - "Unit test for render + answer emit"
  - "Typecheck, build green"
---

# Epic 32.1 — Shell Collector: Core Mechanic + Assets

## Goal

Replace submarine-sort with Shell Collector minigame — tap-to-reach-target mechanic. Scene shows creature with a shells; child taps to add b more; when count = a + b, emit answer.

## Implementation

1. **MinigameShellCollector.vue**: New component
   - Props: question (AdditionQuestion), difficultyParams
   - Emit: answer(choice)
   - Scene: creature with a shells; tap zone adds 1 shell per tap
   - Count visible; when count = a + b → emit answer(correctAnswer)
   - Overtap: gentle shake feedback, optional soft reset
   - Keyboard: Tab to tap zone, Enter/Space to add shell
   - Reduced motion: instant state changes

2. **Assets**: assets/graphics/minigames/shell-collector/
   - creature.svg, shell.svg
   - Total < 10 KB

3. **Tests**
   - Unit: render, tap adds shells, correct count emits answer, overtap shake
