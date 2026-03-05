# QA — Epic 21.4

**Source:** docs/design/epic-21.md

## Unit Tests

- Timer logic (Fish Feed): countdown, expiry, reduced-motion behavior
- Component rendering: both minigames mount with question + onAnswer
- Answer submission: correct/incorrect feedback

## E2E (Playwright, container-only)

- Smoke: Fish Feed and Coral Builder render, interaction works, answer submits
- Flow: map → play → minigame → complete

## Non-flaky

- data-testid for element presence
- Deterministic seeds for reproducible sequences
