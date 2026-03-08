# Epic 27 Design Bible — Coral Minigame Redesign

> PlanRef (master): artifacts/archive/epic-27.0/latest
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Kleuters (4–6 jaar) and their parents, Dutch-speaking (Netherlands/Flanders).

**Primary experience goal:** Replace the current Coral Builder minigame ("plaats het koraal op de juiste plek") with a genuinely playful kids' game. The new minigame must feel tactile, satisfying, and distinct — it does NOT need to resemble other minigames.

**"Looks/feels like" acceptance criteria:**
1. User performs a concrete action (e.g. drag coral onto reef) — not abstract number picking
2. Scene shows reef + coral pieces as game objects
3. Correct answer: satisfying feedback (snap-in, glow)
4. Wrong answer: gentle return, no punishment; hint after 2 wrong
5. Keyboard-playable, reduced-motion support

**Non-goals:** Changing other minigames, new math operators, backend changes, i18n beyond Dutch.

---

## 2. Visual Direction (Art Director)

**Theme directive:** Coral as hero. Reef base + coral pieces as tangible game objects. Playful, underwater, kid-friendly.

**Color palette:** Reuse `--app-primary`, `--app-secondary`, `--app-correct`, `--app-wrong`, `--app-surface`. Coral accents: #ff8a65, #ffab91 (warm, friendly). Reef base: teal/stone.

**Shapes:** Chunky, rounded, flat SVG. No sharp edges or realistic texture.

**Icon style:** Flat SVG, consistent with existing assets/graphics/. Per asset < 2 KB.

**Background patterns:** Reuse underwater gradient; optional subtle bubbles.

**Do:** Reef scene, coral pieces as objects, 44px tap targets, reduced motion.

**Don't:** Realistic coral, tiny details, flashing.

---

## 3. UX Layout & Components (UX Designer)

**Primary screens impacted:** `/play` (minigame area within GameStageCard).

**Layout:**
- Source zone: coral pieces (choices) as draggable items
- Reef zone: reef base with one drop target
- Flow: ProblemCard → Coral Scene → User drags/taps → Answer → Feedback

**Component catalog:** MinigameCoralBuilder.vue (full replacement), same props/emit. MinigameRenderer, useMinigame unchanged except contractV2.

**Tap targets & accessibility:** All interactive ≥ 44px. Tab through pieces and slot; Enter/Space to select/place.

---

## 4. Motion & Audio Rules (Motion/Audio)

| Event | Animation | Duration |
|-------|-----------|----------|
| Piece hover | Scale 1.05 | 150ms |
| Drag start | Scale 1.05, lift | 150ms |
| Correct drop | Snap + reef glow | 300ms |
| Wrong drop | Wobble, return | 400ms |

**Reduced motion:** Instant state changes, no wobble/bounce.

**Audio:** Reuse playCelebrate, gentle wrong SFX. Optional soft "thunk" on correct drop.

---

## 5. Accessibility (UX + QA)

- **Keyboard:** Tab through pieces → select; Tab to slot → Enter to place
- **Focus:** Visible focus ring on all interactive elements
- **Contrast:** WCAG AA
- **Reduced motion:** Animations degrade to instant

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Component:** MinigameCoralBuilder.vue — full rewrite. Props: question, difficultyParams. Emit: answer(choice).

**Assets:** `assets/graphics/minigames/coral-builder/` — reef-base.svg, coral-piece-1.svg, coral-piece-2.svg. Total < 15 KB.

**Registry:** useMinigame coral-builder — interactionType: `drag-drop`, layoutClass: `layout-drag-reef`.

**Files:** MinigameCoralBuilder.vue, useMinigame.ts, nl.json, e2e specs.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Unit:** Renders, emits answer on correct drag/keyboard. Wrong returns, no emit.

**E2E:** Coral builder round completes via drag or keyboard. interaction-diversity, mechanic-upgrades may need updates.

**Visual:** Screenshot baseline for coral minigame.

---

## 8. Security/Privacy Notes (Security/Privacy)

**New risks:** None. No new auth, data, or external calls.

---

## 9. Slice Map (Orchestrator)

### Epic 27.1 — Coral Minigame: Core Mechanic + Assets

**Visual milestone:** Drag-to-place coral on reef works; reef + pieces visible.

**Files:** MinigameCoralBuilder.vue, assets/graphics/minigames/coral-builder/*.svg

**Acceptance:** Drag correct piece → answer; keyboard fallback; reef + coral SVGs.

---

### Epic 27.2 — Coral Minigame: Polish + Feedback

**Visual milestone:** Animations, wrong-answer feedback, hint after 2 wrong.

**Files:** MinigameCoralBuilder.vue (animations, hint logic)

**Acceptance:** Snap-in, wobble-return, hint; reduced motion; a11y pass.

---

### Epic 27.3 — Coral Minigame: Integration + E2E

**Visual milestone:** Registry, Dutch copy, E2E green.

**Files:** useMinigame.ts, nl.json, e2e/*.spec.ts

**Acceptance:** contractV2 updated; Dutch strings; E2E passes; bundle budget.
