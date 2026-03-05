# Epic 21.3 — QA

**Source:** docs/design/epic-21.md

## Unit Tests

- **BubblePop:** Accepts question + onAnswer props; calls onAnswer with correct choice on tap
- **TreasureDive:** Accepts question + onAnswer props; calls onAnswer with correct choice on drag/select
- **useMinigame:** Resolves bubble-pop and treasure-dive to correct components

## E2E (Playwright, container-only)

- Play round with Bubble Pop: render, tap correct bubble, answer submits
- Play round with Treasure Dive: render, drag correct gem to chest, answer submits
- Keyboard fallback: Treasure Dive playable via Tab + Enter
- Reduced motion: instant state change (no animation delay)

## Non-Flaky Assertions

- Use `data-testid` for element presence
- Deterministic seeds for reproducible sequences
- Stable selectors: prefer `data-testid`, `aria-label`
