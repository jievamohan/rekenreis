---
id: "0051"
title: "hint-components"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create HintDots.vue: show a + b as dot groups"
  - "Create HintNumberLine.vue: horizontal 0..max with a, b, a+b marked"
  - "Both accept props: a, b, correctAnswer (number)"
  - "Accessible: aria-label describes the hint"
  - "Respect prefers-reduced-motion (simplified or static)"
scope_out:
  - "Play integration"
acceptance:
  - "HintDots renders a dots, b dots, = ?"
  - "HintNumberLine renders line with markers"
  - "Components are keyboard-focusable if interactive; else presentational"
  - "Typecheck passes"
lanes:
  - name: "W1"
    files: ["apps/web/components/hints/HintDots.vue", "apps/web/components/hints/HintNumberLine.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 9 Task 2. Hint visuals for dots and number-line modes.
