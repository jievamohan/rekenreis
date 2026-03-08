---
id: "0138"
title: "epic28-1-memory-match-component"
scope_in:
  - "apps/web/components/minigames/MinigameMemoryMatch.vue"
  - "apps/web/assets/graphics/minigames/memory-match/"
  - "apps/web/composables/useMinigame.ts"
scope_out:
  - "Polish/animations (28.2)"
  - "E2E visual regression (28.3)"
lanes: ["W1", "W2"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "MinigameMemoryMatch.vue: grid of face-down cards (6–8)"
  - "Flip two cards; correct pair → emit answer; wrong pair → flip back after delay"
  - "Card back SVG in assets/graphics/minigames/memory-match/"
  - "Keyboard: Tab through cards, Enter to flip"
  - "Props: question, difficultyParams; emit: answer"
  - "Same contract as other minigames"
  - "Register in useMinigame"
  - "SVG assets < 10 KB total"
  - "Typecheck clean"
---

# Epic 28.1 — Memory-Match: Component + Assets

## Goal

Create MinigameMemoryMatch.vue with flip logic and card back SVG.

## Implementation

1. Create assets/graphics/minigames/memory-match/card-back.svg (kid-friendly, underwater theme, < 2 KB)
2. Create MinigameMemoryMatch.vue:
   - Grid of 6–8 face-down cards (from question.choices; two sum to correctAnswer)
   - Cards: face-down (card-back.svg), face-up (number)
   - Flip two: if sum === correctAnswer → emit('answer', correctAnswer); else → flip back after ~800ms
   - Keyboard: Tab through cards, Enter to flip; second Enter on another card to flip pair
   - difficultyParams: cardCount (6–8)
3. Register in useMinigame (replace coral-builder)
