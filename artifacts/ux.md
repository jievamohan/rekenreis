# Epic 9 — Adaptive Assistance: UX

## Principles

- Feedback stays positive: no "Wrong!", no negative score; use "Try again", "Here's a hint"
- Hints are supportive, not punitive
- No hard fail state: child can always continue
- Reduced motion: respect `prefers-reduced-motion`

## Hint Reveal Flow

1. First wrong: "Not quite. Want a hint? [Show hint]" or auto-show after short delay
2. Second wrong (same question or next): auto-reveal hint (dots/number line)
3. After hint: "Next" to continue; no time limit

## Hint Visuals

| Type | Description |
|------|-------------|
| dots | Show a + b as dot groups (e.g. ●●● + ●● = ?) |
| number-line | Horizontal line 0..20 with a, b, a+b marked |
| grouping | Visual grouping (e.g. (a) + (b) in boxes) |

## Pacing Intervention

- "Struggling" = 3+ wrong in last 5 answers (or similar threshold)
- Action: next 2–3 rounds use easier pacing tag (from level pack)
- No UI announcement; seamless
- Reset when child gets 2 correct in a row

## Choice Reduction (optional, Phase 2)

- After 3 wrong on same question: remove 1 distractor (show 3 choices instead of 4)
- Only if question has 4 choices
- Reset on next question
