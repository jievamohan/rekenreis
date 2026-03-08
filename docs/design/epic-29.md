# Epic 29 Design Bible — Star Scoring Based on Correct Answers

> PlanRef (master): artifacts/archive/epic-29.0/latest
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Kleuters (4–6 jaar), Dutch-speaking.

**Primary experience goal:** Stars at level end reflect **correct answers**, not inverse of mistakes. A threshold may apply before the first star. Players can replay to improve; stored score never decreases.

**"Looks/feels like" acceptance criteria:**
1. Stars = f(correctCount, totalRounds) with configurable thresholds
2. 0 stars possible when below threshold (e.g. <3 correct of 10)
3. Replay improves score when player does better
4. Best score per level never overwritten downward

**Non-goals:** New minigames, map/decoration changes, backend, changing rounds per level.

---

## 2. Visual Direction (Art Director)

**N/A:** No visual redesign. Scoring logic only. LevelCompleteModal and MapNode display 0–3 stars (existing layout).

---

## 3. UX Layout & Components (UX Designer)

**Primary screens impacted:** `/play` (level complete), LevelCompleteModal, `/map` (MapNode).

**Component catalog:**
- LevelCompleteModal — accept stars 0–3; 0-star message "Probeer opnieuw"
- MapNode — display 0–3 stars (unchanged)
- useLevelProgress — accept 0 stars
- play.vue — compute stars from correctCount

**Tap targets & accessibility:** No new elements. Existing CTAs unchanged.

---

## 4. Motion & Audio Rules (Motion/Audio)

**N/A:** No new motion or audio. Confetti for 2+ stars; reduced-motion unchanged.

---

## 5. Accessibility (UX + QA)

- No new keyboard/focus changes
- 0-star state: friendly message, no punitive tone
- Screen reader: stars count announced (existing aria-label)

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Star formula:** `computeStars(correctCount, totalRounds, thresholds?)` → 0–3. Default thresholds [3, 6, 9] for 10 rounds.

**Session stats:** Track correctCount (ref incremented on advanceRound('correct') or derived from roundOutcome).

**Schema:** profileSchema allows stars 0–3 in levelProgress. useLevelProgress.completeLevel accepts 0; best = max(prev, stars).

**Files:** starScoring.ts (or utils), play.vue, useLevelProgress.ts, useMistakes or useSessionStats, profileSchema.ts, LevelCompleteModal.vue, nl.json.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Unit:** computeStars boundaries; useLevelProgress(0 stars, best-only); profileSchema(0 valid).

**E2E:** Level complete with mixed correct/wrong → correct star count; replay improves; replay does not decrease.

**Visual:** LevelCompleteModal 0 stars; MapNode 0 stars (if different).

---

## 8. Security/Privacy Notes (Security/Privacy)

**New risks:** None. No auth, PII, or external calls. Thresholds are code/content.

---

## 9. Slice Map (Orchestrator)

### Epic 29.1 — Star Scoring Logic + Session Stats

**Visual milestone:** Level complete shows stars based on correct answers (not mistakes).

**Files:** utils/starScoring.ts, play.vue, useMistakes or useSessionStats, useLevelProgress.ts

**Acceptance:**
- correctCount tracked per session
- computeStars(correctCount, totalRounds) returns 0–3 with thresholds
- play.vue uses computeStars instead of mistakeCount
- Unit tests: computeStars, useLevelProgress (0 stars, best-only)

---

### Epic 29.2 — Schema + Persistence + UI Polish

**Visual milestone:** 0 stars displayed when below threshold; replay never decreases score.

**Files:** profileSchema.ts, LevelCompleteModal.vue, nl.json, MapNode (verify), e2e specs

**Acceptance:**
- profileSchema allows stars 0–3
- useLevelProgress accepts 0, no min-1 clamp
- LevelCompleteModal shows "Probeer opnieuw" for 0 stars
- E2E: replay improves; replay does not decrease; threshold boundaries
- Typecheck, build, smoke green
