# Epic 6 — Game Modes Framework: UX

## Interaction Modes

### Classic (default)
- Current behavior: question, 3–4 choice buttons, immediate feedback, Next.
- No changes to UX.

### Timed-pop
- Question + choices displayed.
- Mild timer (configurable, generous, e.g. 15–20 seconds).
- If user answers: same feedback flow as classic.
- If time runs out:
  - Friendly message: "Time's up! The answer was X."
  - Reveal correct answer.
  - Continue button → next question. No fail state, no penalty.
- Timer must not block: keyboard users can still select and answer.
- Timer is visual only; no hard failure.

## Routing

- `/play` → classic, infinite content
- `/play?mode=classic` → classic
- `/play?mode=timed-pop` → timed-pop
- `/play?source=pack` or `/play?mode=pack` (legacy) → content pack
- `/play?mode=timed-pop&source=pack` → timed-pop with pack content

## Accessibility

- Keyboard: all modes playable without mouse.
- Timer: does not block progress; user can always answer.
- Focus management: unchanged from classic.
