# Game Feel — Epic 28 (Game Designer)

## Goal

Stars must feel earned based on **correct answers**, not punishment for mistakes. A threshold before the first star avoids rewarding very low performance while still allowing improvement through replay.

## Star Formula (Proposed)

- **Input:** `correctCount`, `totalRounds` (e.g. 10 per level)
- **Threshold:** Minimum correct for 1 star (e.g. 3 of 10 = 30%)
- **Mapping:**
  - 0 stars: correctCount < threshold
  - 1 star: threshold ≤ correctCount < tier2
  - 2 stars: tier2 ≤ correctCount < tier3
  - 3 stars: correctCount ≥ tier3

Example thresholds (configurable):
- 1 star: ≥3 correct (30%)
- 2 stars: ≥6 correct (60%)
- 3 stars: ≥9 correct (90%)

## Replay

- Player can retry level from MistakesReview or replay from map
- New stars = computeStars(correctCount, totalRounds)
- Stored stars = max(previousBest, newStars)
- Score never decreases

## Kid-Safe

- No punitive messaging for 0 stars; encourage "probeer opnieuw"
- Positive framing: "Je hebt X van Y goed!"
