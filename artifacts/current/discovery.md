# Discovery — Epic 28 (Business Analyst)

## Intent

Fix het aantal sterren dat een speler krijgt aan het einde van het spel. Dit moet op basis van het aantal goed antwoorden zijn. Het mag hierbij ook zijn, dat er eerst een threshold is, voordat de eerste ster wordt gegeven. Een speler moet een level opnieuw kunnen spelen, om een hogere score te kunnen halen. De score zal nooit lager worden, dan de hoogste behaalde voor die level.

## Summary (English)

Fix the star rating at level end. Stars must be based on **number of correct answers** (not mistakes). A threshold may apply before the first star is awarded. Players must be able to replay levels to improve; the stored score must never decrease below the best achieved for that level.

## Current State

- Stars are computed from **mistake count**: 0 wrong = 3, 1 wrong = 2, 2+ wrong = 1
- `useLevelProgress.completeLevel` already keeps best stars (`Math.max(prev, clamped)`)
- Replay is supported (retry level, back to map)
- Schema: `levelProgress[level].stars` must be 1–3 (0 not allowed)

## Desired State

1. **Star calculation:** Based on correct answers (e.g. correctCount / totalRounds)
2. **Threshold:** Optional minimum correct answers before first star (e.g. need 3 correct for 1 star)
3. **Replay:** Player can replay level; score improves if they do better
4. **Best-only:** Stored score never lower than best achieved (already implemented)

## Success Criteria

- Stars reflect performance (correct answers), not inverse of mistakes
- Threshold configurable (e.g. 30% correct for 1 star)
- Replay improves score when player does better
- Best score per level is never overwritten downward
