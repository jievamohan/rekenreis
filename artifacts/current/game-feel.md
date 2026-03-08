# Game Feel — Epic 28: New Minigame (Replace Coral)

## Mechanic Options (Pick One)

We need a mechanic **not** currently used:

| Mechanic | Used By | Candidate |
|----------|---------|-----------|
| tap-choice | bubble-pop | — |
| drag-drop | treasure-dive, coral-builder | **No** (replacing coral) |
| timed-pop | fish-feed, starfish-match | — |
| sort-into-bins | submarine-sort | — |
| **memory-flip** | — | **Yes** |
| **trace-numberline** | — | **Yes** |
| **build-sequence** | — | **Yes** |
| swipe-match | — | Yes (touch-heavy; consider a11y) |

## Recommended: Memory-Flip

**Gameplay:**
- Grid of face-down cards (e.g. 6–8 cards)
- Each card has a number (from question.choices: correctAnswer + distractors)
- Two cards sum to correctAnswer; others are distractors
- Player flips two cards. If they sum to correctAnswer → match! (cards stay face-up, glow). Otherwise → flip back after short delay
- Win when the correct pair is found

**Why it fits:**
- Universally recognized (memory game)
- No drag-drop; distinct from Treasure Dive
- Layout is a grid of cards — not "row of answer buttons"
- Kid-friendly, low frustration (no timer pressure by default)
- Keyboard: Tab through cards, Enter to flip; second Enter on another card to flip pair

## Alternative: Trace-Numberline

**Gameplay:**
- Number line from 0 to max(a+b, 10)
- Start at `a`, "jump" `b` steps to land on answer
- Tap/click each step or drag along path
- Correct landing → celebration

**Why it fits:**
- Spatial, visual, supports number sense
- No drag-drop
- Different layout (linear path vs grid/buttons)

## Recommendation

**Primary:** memory-flip — highest differentiation, proven kid appeal.
**Fallback:** trace-numberline — if memory-flip proves too complex for kleuters.
