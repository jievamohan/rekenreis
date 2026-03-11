# Epic 36 Design Bible — Minigame Result Modal Integration Tests

> PlanRef (master): artifacts/archive/epic-36.0/latest  
> Living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)
- **Target audience:** Developers, QA, eindgebruikers (kinderen) die correcte feedback verwachten
- **Primary experience goal:** Resultaatschermen tonen altijd correcte score, tijd, combo, XP
- **"Looks/feels like" acceptance criteria:**
  - E2E-tests doorlopen alle 6 minigames
  - 0%, 40%, 80%, 100% succesrate gesimuleerd en geverifieerd
  - Modal toont correcte correct/total, score%, sterren
  - Audit log welke info waar fout was; fixes toegepast
- **Non-goals:** Nieuwe minigames, wijzigingen aan spelmechanica, backend

## 2. Visual Direction (Art Director)
N/A: Geen visuele wijzigingen.

## 3. UX Layout & Components (UX Designer)
- **Primary screens impacted:** LevelCompleteModal
- **Component catalog:** LevelCompleteModal.vue, play.vue (data flow)
- **Tap targets & accessibility:** Geen wijzigingen

## 4. Motion & Audio Rules (Motion/Audio)
N/A: Geen wijzigingen.

## 5. Accessibility (UX + QA)
- Bestaande modal a11y blijft
- Geen wijzigingen aan focus/keyboard

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)
- **E2E:** `e2e/minigame-result-modal.spec.ts`
- **Helpers per minigame:** answerBubblePop, answerTreasureDive, answerFishFeed, answerMemoryMatch, answerStarfishMatch, completeBouwDeToren
- **play.vue:** correctCount, roundsPerLevel, towerCorrectRounds, towerRoundsTotal, completedLevelStats
- **LevelCompleteModal:** props correctCount, roundsTotal, scorePercent, timeFormatted, comboMax, xpGained

## 7. Test Strategy & Regression Plan (QA Strategist)
- **E2E:** 6 minigames × 4 success rates (waar van toepassing); modal assertions
- **Assertions:** performance-bar, score%, time, combo, XP, stars
- **Non-flaky:** deterministic answers; timersDisabled waar mogelijk
- **Regression:** level-complete.spec.ts, interaction-diversity.spec.ts blijven groen

## 8. Security/Privacy Notes (Security/Privacy)
- Geen nieuwe risico's
- Geen auth/crypto/payment/PII

## 9. Slice Map (Orchestrator)

| Epic | Title | Visual milestone | Files | Acceptance |
|------|-------|------------------|-------|------------|
| 36.1 | E2E Helpers + Round-Based 100%/0% | Tests pass voor bubble-pop, treasure-dive, fish-feed, memory-match, starfish-match | e2e/minigame-result-modal.spec.ts | 5 minigames × 100% en 0% green |
| 36.2 | 40%/80% Tests + Modal Assertions | Strikte assertions op correct, score%, sterren | e2e/minigame-result-modal.spec.ts | 40%/80% green; assertions strict |
| 36.3 | Audit + Result Modal Fixes | Log + fixes; alle round-based tests pass | play.vue, LevelCompleteModal.vue, artifacts | Audit doc; fixes toegepast |
| 36.4 | Bouw-de-Toren Result Tests | Tower 0/3 sterren E2E | e2e/minigame-result-modal.spec.ts | Tower tests green |
| 36.5 | Polish + CI | Retries, non-flakiness, gate C/D/F | e2e/, CI config | CI green; gates pass |
