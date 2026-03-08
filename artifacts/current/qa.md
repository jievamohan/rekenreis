# QA Strategy — Epic 27 (QA Strategist)

## Unit Tests

- **MinigameCoralBuilder:** Renders, accepts question prop, emits answer on correct selection
- **Drag path:** Simulate pointer events or use testing-library; verify correct drop emits answer
- **Keyboard path:** Tab + Enter flow emits answer
- **Wrong answer:** Wrong piece returns to tray; no emit until correct
- **Hint:** After 2 wrong, hint appears (if implemented)

## E2E Updates

- **minigame.spec.ts:** Coral builder round — complete with drag or keyboard
- **interaction-diversity.spec.ts:** Ensure coral-builder still satisfies drag-drop coverage (if it becomes primary drag game)
- **mechanic-upgrades.spec.ts:** May need update if coral-builder interaction type changes
- **sorting-sequence.spec.ts:** If coral-builder was used for sequence, update to new mechanic

## Non-Flaky Assertions

- Wait for minigame to load (data-testid="minigame-coral-builder")
- Use deterministic seed or mock question for reproducible choices
- Avoid timing-dependent assertions; use state-based checks

## Visual Regression

- Screenshot baseline for coral minigame (initial state, pieces visible)
- Update if existing coral baseline exists

## Acceptance Checklist

- [ ] Coral minigame renders with reef + pieces
- [ ] Drag correct piece to reef → answer submitted, feedback shown
- [ ] Keyboard: select piece + slot → answer submitted
- [ ] Wrong piece returns; no punishment
- [ ] Reduced motion: no wobble/bounce
- [ ] Dutch copy correct
- [ ] Bundle budget passes
