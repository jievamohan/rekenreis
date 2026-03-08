# Epic 28 Design Bible — Replace Coral with Memory-Match

> PlanRef (master): artifacts/archive/epic-28.0/latest
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Kleuters (4–6 jaar), Dutch-speaking.

**Primary experience goal:** Replace the coral-builder minigame (Epic 27) with a completely new game. Coral was drag-drop, duplicating Treasure Dive. The new minigame must have different gameplay and a distinct look/feel to give kids more variety.

**"Looks/feels like" acceptance criteria:**
1. New mechanic: memory-flip (flip cards to find pair that sums to answer) — not drag-drop
2. Layout: grid of cards, not "row of answer buttons"
3. Correct match: satisfying feedback (glow, celebrate)
4. Wrong pair: flip back gently; hint after 2 wrong
5. Keyboard-playable, reduced-motion support

**Non-goals:** Changing other minigames, new math operators, backend, i18n beyond Dutch.

---

## 2. Visual Direction (Art Director)

**Theme directive:** Card-based memory game. Flat illustrated card backs (shells, fish, bubbles). Warm, tactile, board-game feel. Totally different from bubble/treasure/fish/coral/submarine/starfish.

**Color palette:** Reuse app tokens. Card backs: teal/cyan gradients. Card faces: large numbers on soft pastel backgrounds.

**Shapes:** Rounded rectangles (cards), chunky corners. No sharp edges.

**Icon style:** Flat SVG, consistent with assets/graphics/. Per asset < 2 KB.

**Do:** Dense grid of cards, 44px tap targets, reduced motion.
**Don't:** Reuse coral assets; mimic other minigame visuals.

---

## 3. UX Layout & Components (UX Designer)

**Primary screens impacted:** `/play` (minigame area).

**Layout:** Grid of face-down cards (6–8). ProblemCard remains above (a + b = ?). Cards are the answer-discovery mechanism — layout differs from "row of answer buttons."

**Component catalog:** MinigameMemoryMatch.vue (new), replaces MinigameCoralBuilder.vue. MinigameRenderer, useMinigame updated.

**Tap targets & accessibility:** Cards ≥ 44px. Tab through cards, Enter to flip.

---

## 4. Motion & Audio Rules (Motion/Audio)

| Event | Animation | Duration |
|-------|-----------|----------|
| Card flip (reveal) | 3D flip / scale-y | 200ms |
| Match found | Glow pulse | 300ms |
| Wrong pair | Shake, flip back | 400ms |

**Reduced motion:** Instant state changes, no shake/bounce.

**Audio:** playCelebrate on correct. Optional flip SFX.

---

## 5. Accessibility (UX + QA)

- **Keyboard:** Tab through cards, Enter to flip
- **Focus:** Visible focus ring
- **Contrast:** WCAG AA
- **Reduced motion:** Animations degrade to instant

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Component:** MinigameMemoryMatch.vue. Props: question, difficultyParams. Emit: answer(choice).

**Types:** Add `memory-match` to MinigameId; remove `coral-builder`. Add to MINIGAME_IDS.

**Registry:** memory-match — interactionType: `memory-flip`, layoutClass: `layout-match-grid`.

**Map:** Replace all coral-builder entries with memory-match in minigame-map.v1.json.

**Assets:** `assets/graphics/minigames/memory-match/` — card-back.svg. Total < 10 KB.

**Files:** MinigameMemoryMatch.vue (new), delete MinigameCoralBuilder.vue, useMinigame.ts, minigame.ts, minigame-map.v1.json, nl.json, e2e specs.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Unit:** Renders, flip logic, correct pair emits answer, wrong flips back.

**E2E:** Memory-match round completes via flip + match. Update interaction-diversity, mechanic-upgrades.

**Visual:** Screenshot baseline for memory-match.

---

## 8. Security/Privacy Notes (Security/Privacy)

**New risks:** None. No new auth, data, or external calls.

---

## 9. Slice Map (Orchestrator)

### Epic 28.1 — Memory-Match: Core Mechanic + Assets

**Visual milestone:** Card grid renders, flip two cards, correct pair submits answer.

**Files:** MinigameMemoryMatch.vue, assets/graphics/minigames/memory-match/, types/minigame.ts, useMinigame.ts, minigame-map.v1.json, delete MinigameCoralBuilder.vue

**Acceptance:** Flip pair, correct match → answer; keyboard; card-back SVG.

---

### Epic 28.2 — Memory-Match: Polish + Feedback

**Visual milestone:** Flip animation, match glow, wrong-pair feedback, hint after 2 wrong.

**Files:** MinigameMemoryMatch.vue, nl.json

**Acceptance:** Animations, hint, reduced motion, Dutch copy.

---

### Epic 28.3 — Memory-Match: Integration + E2E

**Visual milestone:** E2E green, visual baseline, bundle budget.

**Files:** e2e/*.spec.ts, visual baselines

**Acceptance:** E2E passes, visual baseline, bundle budget, CI green.
