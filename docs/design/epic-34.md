# Epic 34 Design Bible — Bouw de Toren (Tower-Building Minigame)

> PlanRef (master): artifacts/archive/epic-34.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Kinderen basisschoolleeftijd (rekenvaardigheid tot ~20). Dutch-speaking.

**Primary experience goal:** Vervang shell-collector met "Bouw de Toren": drag 2 blokken naar 2 dropzones; som = doelgetal. Geen shared pool; elke toren eigen verse blokkenpool. Kindvriendelijk, herstelgericht, visueel rustig.

**"Looks/feels like" acceptance criteria:**
1. Eén actieve toren; groot doelgetal; twee duidelijke dropzones; brede rij getalblokken
2. Correct: positieve feedback + korte som-weergave; fout: blokken veren terug
3. Hint bij 2 fouten; laatste kans bij 3; ronde-skip bij 4
4. Sterren configureerbaar (1/2/3 op basis van correcte rondes)
5. Schaalbaar naar 20+ levels; uitbreidbaar naar meerdere oplossingen per toren

**Non-goals:** Shared pool tussen torens; API/backend; multiplayer.

---

## 2. Visual Direction (Art Director)

**Theme directive:** "Magisch avontuur met clean educatief fundament." Visueel rustig.

**Color palette:** Bestaande design tokens; geen nieuwe palette.

**Typography:** Doelgetal groot, bold; blok-nummers helder. Zelfde font als ProblemCard.

**Shapes:** Toren simpel, symbolisch; blokken vierkant/rechthoek met getal.

**Icon style:** SVG, flat; tower.svg ~5–10 KB.

**Do:** Groot doelgetal, duidelijke dropzones, rustige blokkenrij.  
**Don't:** Druk decor, kleine blokken, overlappende zones.

---

## 3. UX Layout & Components (UX Designer)

**Primary screens impacted:** `/play` (minigame area).

**Layout:** Focus-first. Doelgetal > toren > blokken > voortgang. Progress zichtbaar op ronde- en levelniveau.

**Component catalog:**
- MinigameBouwDeToren.vue (hoofd)
- TowerPuzzle.vue (enkele toren: doelgetal + dropzones + blokken)
- Hint / laatste-kans modals

**Tap targets:** Blokken min. 44×44px; dropzones duidelijk. Tab/Enter/Space (keyboard parity).

---

## 4. Motion & Audio Rules (Motion/Audio)

| Event | Animation | Duration |
|-------|-----------|----------|
| Blok drop | Snap naar dropzone | 150–200ms |
| Fout | Terugveren naar pool | 200–300ms |
| Correct | Highlight + som weergave | ~300ms |
| Ronde/level overgang | Rustige transitie | 200–400ms |

**Reduced motion:** Instant state changes.  
**Sound:** Reuse playCorrect, playWrong, playCelebrate.

---

## 5. Accessibility (UX + QA)

- **Keyboard:** Tab/Enter/Space voor selectie en plaatsing (zelfde model als treasure-dive).
- **Focus:** Zichtbare focus ring op blokken en dropzones.
- **Contrast:** WCAG AA.
- **Reduced motion:** Animations → instant.
- **Screen reader:** Doelgetal en dropzones geannounceerd.

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Contract mismatch:** Huidige play-loop = 1 round = 1 question. Bouw de Toren = level-consuming: minigame runt volledige level, emit `levelComplete({ stars })`.

**Components:** MinigameBouwDeToren.vue, TowerPuzzle.vue, useTowerLevelEngine.ts, towerLevelGenerator.ts.

**Config:** content/levels.bouw-de-toren.v1.json of uitbreiding; rounds, towersPerRound, starThresholds, targetRange, blockPoolSize.

**Registry:** useMinigame — id `bouw-de-toren`, interactionType `drag-drop`, layoutClass `layout-tower-dualzone`. Props: levelConfig i.p.v. AdditionQuestion.

**Assets:** assets/graphics/minigames/bouw-de-toren/tower.svg.

**play.vue:** Bij bouw-de-toren: geen per-round advance; wacht op levelComplete → completeLevel, LevelCompleteModal.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Unit:** useTowerLevelEngine (rondes, fouten, sterren); towerLevelGenerator (min. 1 oplossing, seed); MinigameBouwDeToren render + emit.

**E2E:** Map → level 5 → Bouw de Toren; voltooi ronde; level complete. Update interaction-diversity; verwijder shell-collector.

**Non-flaky:** data-testid op toren, blokken, dropzones. Fake RNG.

---

## 8. Security/Privacy Notes (Security/Privacy)

**New risks:** Geen. Lokaal; geen auth/payments/PII.

**Config:** Trusted JSON content.

---

## 9. Slice Map (Orchestrator)

**Epic 34.1** — Domain Engine + Level Generator  
- Milestone: Engine + generator + types + unit tests  
- Files: useTowerLevelEngine.ts, towerLevelGenerator.ts, types  
- Acceptance: Rondes/torens/fouten/sterren correct; gegenereerde pools hebben min. 1 oplossing

**Epic 34.2** — Core Mechanic + UI  
- Milestone: Minigame rendert; drag 2 blokken; validate sum; emit  
- Files: MinigameBouwDeToren.vue, TowerPuzzle.vue  
- Acceptance: Toren werkt in isolatie; doelgetal, dropzones, blokken; keyboard

**Epic 34.3** — Error Flow + Feedback  
- Milestone: Hint, laatste kans, ronde-skip; terugveren; correct-feedback  
- Files: MinigameBouwDeToren.vue, TowerPuzzle.vue, nl.json  
- Acceptance: 2→hint, 3→laatste kans, 4→skip; fout = terugveren; correct = som

**Epic 34.4** — Stars + Progress  
- Milestone: Sterrensysteem; ronde/level progress UI  
- Files: useTowerLevelEngine, MinigameBouwDeToren, starScoring  
- Acceptance: Sterren configureerbaar; progress indicator

**Epic 34.5** — play.vue Integration  
- Milestone: Level-consuming flow; map; shell-collector vervanging  
- Files: play.vue, useMinigame.ts, minigame.ts, minigame-map.v1.json  
- Acceptance: Level 5 = Bouw de Toren; levelComplete → modal; shell-collector weg

**Epic 34.6** — Assets + Polish  
- Milestone: tower.svg, styling, i18n, E2E, bundle budget  
- Files: assets, nl.json, e2e  
- Acceptance: E2E green; bundle budget; i18n compleet
