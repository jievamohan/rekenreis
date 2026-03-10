# Epic 32 Design Bible — Submarine-Sort Replacement (Shell Collector)

> PlanRef (master): artifacts/archive/epic-32.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Kleuters (4–6 jaar), primary focus 6-year-olds. Dutch-speaking (Netherlands/Flanders).

**Primary experience goal:** Replace submarine-sort with a genuinely different minigame. The math (a + b) is embedded in the game narrative and interaction—no "sum above, answers below." Mechanic: tap-to-reach-target (add N more to reach the sum).

**"Looks/feels like" acceptance criteria:**
1. Child never sees ProblemCard; full scene is the game
2. Scene shows creature with a shells; child taps to add b more; count visible
3. When count = a + b: celebration
4. Overtap: gentle feedback, no punishment
5. Keyboard-playable, reduced-motion support

**Non-goals:** Changing other minigames, new math operators, backend changes, i18n beyond Dutch.

---

## 2. Visual Direction (Art Director)

**Theme directive:** Shell Collector (Schelpen Verzamelaar). Octopus or sea creature collects shells. Child helps by adding shells until the creature has the right amount.

**Color palette:** Reuse `--app-primary`, `--app-secondary`, `--app-correct`, `--app-wrong`, `--app-surface`. Accent: warm coral/pearl (#ffccbc, #b2dfdb). Creature: soft teal/mint.

**Typography:** Numbers in-scene: large, chunky (min 24px). Font: var(--app-font).

**Shapes:** Chunky, rounded, flat. Shells: simple curved shapes. Creature: blob-like, no sharp edges.

**Icon style:** Flat SVG, per asset < 3 KB.

**Background patterns:** Reuse underwater gradient. Optional: subtle bubbles.

**Do:** One clear focal character, 44px tap targets, reduced-motion support.  
**Don't:** Realistic textures, tiny details, flashing.

---

## 3. UX Layout & Components (UX Designer)

**Primary screens impacted:** `/play` (minigame area).

**Layout:** Progress bar (unchanged). No ProblemCard. Full-height minigame scene with math embedded.

**Component catalog:** MinigameShellCollector.vue (new), replaces MinigameSubmarineSort. play.vue: hide ProblemCard for shell-collector (like memory-match).

**Tap targets & accessibility:** All interactive ≥ 44px. Tab + Enter/Space. Descriptive aria-labels.

---

## 4. Motion & Audio Rules (Motion/Audio)

| Event | Animation | Duration |
|-------|-----------|----------|
| Shell tap | Shell appears, scales in | 150ms |
| Count increment | Number pulse | 200ms |
| Correct complete | Creature wiggle + glow | 300ms |
| Overtap | Gentle shake | 250ms |

**Reduced motion:** Instant state changes, no wiggle/pulse.

**Sound:** Reuse playCorrect, playWrong, playCelebrate. Optional soft "plop" on shell add.

---

## 5. Accessibility (UX + QA)

- **Keyboard:** Tab through controls; Enter/Space to add shell
- **Focus:** Visible focus ring on all interactive elements
- **Contrast:** WCAG AA
- **Reduced motion:** Animations degrade to instant
- **Screen reader:** Scene aria-label; count updates announced

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Component:** MinigameShellCollector.vue. Props: question, difficultyParams. Emit: answer(choice).

**Registry:** useMinigame — id `shell-collector`, interactionType `tap-to-increment`, layoutClass `layout-embedded-math`. ProblemCard hidden when layoutClass indicates embedded math.

**Assets:** `assets/graphics/minigames/shell-collector/` — creature.svg, shell.svg. Total < 10 KB.

**Files:** MinigameShellCollector.vue, useMinigame.ts, minigame.ts (MinigameId), minigame-map.v1.json, play.vue, nl.json, e2e specs.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Unit:** Renders, emits answer when child taps b times. Keyboard parity. Overtap handling.

**E2E:** interaction-diversity: replace submarine-sort with shell-collector. sorting-sequence: remove or repurpose. New flow: level 5 → complete round.

**Visual:** Optional screenshot baseline. Reduced motion verified.

---

## 8. Security/Privacy Notes (Security/Privacy)

**New risks:** None. No new auth, payments, or data flows.

**Config:** Minigame id valid in union. Map rules reference existing ids.

**Data handling:** Unchanged.

---

## 9. Slice Map (Orchestrator)

**Epic 32.1** — Shell Collector: Core mechanic + assets  
- Visual milestone: New minigame renders, tap adds shells, count updates, correct emits answer  
- Files: MinigameShellCollector.vue, assets/graphics/minigames/shell-collector/  
- Acceptance: Component works in isolation; props/emit correct

**Epic 32.2** — Integration: play.vue, useMinigame, map, types  
- Visual milestone: Level 5 shows shell-collector; no ProblemCard; round completes  
- Files: play.vue, useMinigame.ts, minigame.ts, minigame-map.v1.json, useDifficultyProgression.ts, nl.json  
- Acceptance: Map → play level 5 → shell-collector; ProblemCard hidden; flow works

**Epic 32.3** — E2E + polish  
- Visual milestone: E2E green; aria-labels; reduced motion  
- Files: e2e specs, nl.json  
- Acceptance: interaction-diversity updated; sorting-sequence removed/repurposed; typecheck, build, smoke green
