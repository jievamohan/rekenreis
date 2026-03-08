---
id: "0136"
title: "epic27-2-coral-polish-feedback"
status: "pending"
scope_in:
  - "apps/web/components/minigames/MinigameCoralBuilder.vue"
scope_out:
  - "apps/api"
  - "useMinigame.ts"
  - "nl.json"
lanes: ["W1", "T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "Correct drop: snap-in animation, reef glow (300ms)"
  - "Wrong drop: wobble, return to tray (400ms)"
  - "After 2 wrong: reveal hint (target highlight)"
  - "Reduced motion: instant state changes, no wobble/bounce"
  - "playCorrect on correct, playWrong on wrong"
  - "Typecheck, build, smoke green"
---

# Epic 27.2 — Coral Minigame: Polish + Feedback

## Goal

Add animations, wrong-answer feedback, and hint after 2 wrong.

## Implementation

1. Correct drop: reef glow animation (300ms)
2. Wrong drop: wobble animation, return to tray (400ms), playWrong
3. After 2 wrong: hint (highlight correct piece)
4. Reduced motion: instant state changes
5. playCorrect on correct, playWrong on wrong
