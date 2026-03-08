# QA Strategy — Epic 28: New Minigame (Replace Coral)

## Unit Tests

- New minigame component: renders, accepts question/difficultyParams
- Flip logic: correct pair emits answer; wrong pair flips back, no emit
- Keyboard: Tab through cards, Enter flips; pair match emits
- Reduced motion: no animations, instant state change

## E2E Smoke Updates

- Replace coral-builder scenarios with memory-match
- `minigame.spec.ts`: play round with memory-match, verify answer submission
- `interaction-diversity.spec.ts`: update if coral was referenced
- `mechanic-upgrades.spec.ts`: update if needed

## Non-Flaky UI Assertions

- Wait for cards to be visible before interaction
- Use data-testid or role for card elements
- Avoid timing-dependent assertions (use waitFor)

## Visual Regression

- Screenshot baseline for memory-match initial state
- Screenshot of matched pair state
- Remove coral-builder baselines
