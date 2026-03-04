# Epic 0: Game Core MVP — UX Design

## Primary user flow(s)

1. User navigates to `/play`.
2. User sees: question (e.g. “3 + 5 = ?”), 3–4 answer buttons, score, streak.
3. User clicks or keys to select an answer.
4. Immediate feedback: correct (e.g. “Correct!”) or incorrect (e.g. “Not quite. It was X.”).
5. After a short delay or explicit “Next” action, next question loads.
6. Repeat; score and streak update.

## Screen/page list and purpose

| Screen | Purpose |
|--------|---------|
| `/play` | Main game screen: question, choices, feedback, score, streak. |

## Interaction model (states)

| State | Description |
|-------|-------------|
| loading | Initial load (minimal; generator is sync for MVP). |
| ready | Question displayed, choices enabled. |
| answered | Feedback shown; choices disabled; “Next” or auto-progress available. |
| (no error state for MVP) | Generator is deterministic; no network calls for game logic. |

## A11y notes

- **Keyboard**: Tab through choices; Enter/Space to select.
- **Focus**: Visible focus ring on buttons; focus moves logically after answer.
- **ARIA**: `role="group"` for question; `aria-live="polite"` for feedback.
- **Labels**: Clear labels for answer buttons (the number value).
- **Contrast**: Sufficient contrast for text and controls.

## Minimal microcopy

- Question: “3 + 5 = ?”
- Correct: “Correct!”
- Incorrect: “Not quite. The answer was 8.”
- Score: “Score: 12”
- Streak: “Streak: 3”
- Next: “Next” (or auto-advance after ~1s)

## UI edge cases

- Empty states: N/A—game always has a question.
- Retries: N/A—no network for game logic.
