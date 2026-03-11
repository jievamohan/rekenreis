# Backlog — Epic 36

## Micro-epics (voorgesteld)
1. **E2E helpers + 100%/0% tests** — Bubble-pop, treasure-dive, fish-feed, memory-match, starfish-match; bouw-de-toren apart
2. **40%/80% tests + result assertions** — Controlled success rate; strikte modal assertions
3. **Audit + fixes** — Log welke info fout; fix play.vue + LevelCompleteModal
4. **Bouw-de-toren result tests** — Tower 0/3 sterren; drag-drop flow
5. **Polish + CI** — Retries, non-flakiness, gate checks

## Tasks (voor /feature)
- Task 1: E2E minigame-result-modal.spec.ts skeleton + helpers voor bubble-pop, treasure-dive, fish-feed
- Task 2: Helpers memory-match, starfish-match; 100%/0% tests voor alle 5 round-based minigames
- Task 3: 40%/80% tests; strikte modal assertions (correct, score%, stars)
- Task 4: Run audit; fix data flow bugs in play.vue / LevelCompleteModal
- Task 5: Bouw-de-toren 0/3 stars E2E; polish; CI green
