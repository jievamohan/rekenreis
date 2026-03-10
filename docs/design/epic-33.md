# Epic 33 Design Bible — Result Modal Redesign

> PlanRef (master): artifacts/archive/epic-33.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Kleuters (4–6 jaar), Dutch-speaking.

**Primary experience goal:** Het resultaat modal aan het eind van elke minigame aanpassen naar een feestelijk, overzichtelijk design (per screenshot). De modal mag niet dismissable zijn; alleen via de geboden buttons sluiten.

**"Looks/feels like" acceptance criteria:**
1. Layout: sterren bovenaan → titel "Level Voltooid!" → subtitle "Je hebt X sterren verdiend!" → Maatje → performance-bar ("Super gedaan! X van de Y goed!") → secundaire buttons → primaire CTA → footer stats (SCORE, TIJD, COMBO, XP)
2. Geen X-knop, geen buitenklik, geen Escape om te sluiten
3. Primaire CTA: "VOLGENDE LEVEL" (niet-laatste) of "NAAR DE KAART" (laatste)
4. Secundair: "Bekijk foutjes" (als hasMistakes), "Nog een keer" (retry)

**Non-goals:** Nieuwe minigames, backend-wijzigingen, wijziging sterren-logica.

---

## 2. Visual Direction (Art Director)

**Theme directive:** Kindvriendelijk, feestelijk, helder. Past bij onderwater/kleurrijk palet.

**Modal:** Wit, afgeronde hoeken, subtiele schaduw, licht groen glow boven sterren.

**Sterren:** Goud (#FFC107) voor verdiend; lichtgrijs voor rest.

**Performance-bar:** Licht groen achtergrond, gecentreerde tekst.

**Buttons:** Primaire CTA heldergroen (gradient), wit tekst, pijltje; secundair "Bekijk foutjes" licht geel, "Nog een keer" wit/grijs.

**Footer stats:** Lichtgrijze capsules; labels klein, waarden groot; COMBO oranje accent, XP groen accent.

**Do:** Maatje prominent; stats duidelijk leesbaar. **Don't:** X-knop; drukke achtergrond in modal.

---

## 3. UX Layout & Components (UX Designer)

**Primary screen:** LevelCompleteModal — na laatste ronde van level.

**Layout (top → bottom):** Sterren → titel → subtitle → Maatje → performance-bar → secundaire buttons → primaire CTA → footer stats.

**Interaction:** Niet dismissable. Focus trap; Tab door buttons; Escape doet niets.

**Component catalog:** LevelCompleteModal.vue (layout wijziging, props uitbreiding).

---

## 4. Motion & Audio Rules (Motion/Audio)

**Animations:** Modal enter, sterren sequentieel pop-in, confetti bij 2+ sterren (bestaand).

**Reduced motion:** Sterren direct tonen, confetti uit.

**Sound:** sound.playCelebrate() (bestaand).

---

## 5. Accessibility (UX + QA)

- aria-modal="true"; geen Escape om te sluiten
- Focus trap; eerste focus op primaire CTA of eerste button
- Tap targets ≥ 44px
- Screen reader: duidelijk dat alleen buttons beschikbaar zijn

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Component:** LevelCompleteModal.vue. Nieuwe props: scorePercent, timeFormatted, comboMax, xpGained.

**play.vue:** Level-timer (start bij level start, stop bij complete); max combo bijhouden; XP-formule; props doorgeven.

**Format:** Tijd MM:SS; Score %; Combo xN; XP +N.

**Files:** LevelCompleteModal.vue, play.vue, nl.json, e2e level-complete.spec.ts.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**E2E:** Modal niet sluitbaar via Escape/buitenklik; buttons werken; stats zichtbaar.

**Bundle:** Gate F moet slagen.

---

## 8. Security/Privacy Notes (Security/Privacy)

**New risks:** Geen. Geen auth, crypto, payments. Client-side alleen.

---

## 9. Slice Map (Orchestrator)

**Epic 33.1** — Layout + non-dismissable  
- Visual milestone: Modal layout per screenshot; geen close; buttons herordend; performance-bar; footer placeholders  
- Files: LevelCompleteModal.vue  
- Acceptance: Layout correct; Escape/overlay sluit niet

**Epic 33.2** — Stats wiring  
- Visual milestone: SCORE, TIJD, COMBO, XP in footer; correcte waarden  
- Files: play.vue, LevelCompleteModal.vue  
- Acceptance: Timer, combo max, XP; props doorgegeven; footer rendert

**Epic 33.3** — Polish + E2E  
- Visual milestone: Styling fine-tune; i18n compleet  
- Files: LevelCompleteModal.vue, nl.json, e2e level-complete.spec.ts  
- Acceptance: E2E green; bundle budget; reduced motion
