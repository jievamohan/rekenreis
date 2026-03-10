# Epic 35 Design Bible — Bouw de Toren Finetune

> PlanRef (master): artifacts/archive/epic-35.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Zelfde als Epic 34 — kinderen basisschoolleeftijd, Dutch-speaking.

**Primary experience goal:** Vijf verfijningen op de bestaande Bouw de Toren:
1. Geen layout shift bij slepen
2. Placeholder blijft op originele locatie na drop
3. Progress (voltooide torens) visueel afzijdig en herkenbaar
4. WCAG contrast voor gedropt blok
5. Doelgetal-presentatie verbeterd (research-gebaseerd)

**"Looks/feels like" acceptance criteria:**
1. Bij pointerdown: geen zichtbare verschuiving
2. Na drop: lege plek blijft in blokkenpool
3. Voltooide torens in eigen rij/sectie; duidelijk onderscheid van actieve dropzones
4. Zone-value leesbaar (≥4.5:1 contrast)
5. Doelgetal prominent; toren-icoon ondersteunend of nummer-only

**Non-goals:** Nieuwe gameplay; nieuwe levels; API/backend.

---

## 2. Visual Direction (Art Director)

**Theme:** Rustig educatief; verfijningen functioneel.

**Progress (voltooide torens):** Eigen rij, andere look (badge, grotere check, groene accent).

**Placeholder:** Dashed, lege cel; "gebruikt" indicatie.

**Zone value:** Donkere tekst op voldoende contrast-achtergrond.

**Doelgetal:** Getal dominant; icon kleiner of weggelaten.

---

## 3. UX Layout & Components (UX Designer)

**Components:** TowerPuzzle.vue, MinigameBouwDeToren.vue.

**Layout wijzigingen:**
- Split towers-row: voltooid vs. actief
- Placeholder in blocks-pool voor placed blocks
- Target-row: getal prominenter

**Tap targets:** Blijven ≥44×44px.

---

## 4. Motion & Audio Rules (Motion/Audio)

**N/A:** Geen nieuwe animaties of geluiden.

---

## 5. Accessibility (UX + QA)

- WCAG AA contrast voor zone-value en target
- Keyboard/focus ongewijzigd
- Reduced motion blijft van kracht

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Files:** TowerPuzzle.vue, MinigameBouwDeToren.vue.

**Placeholder logic:** blocksDisplay toont placeholder voor blocks in zone1/zone2.

**Layout shift:** Placeholder zelfde dimensies als block; block-ghost fixed.

**Doelgetal research (agent):** Optie A (refined tower+number) of nummer-only. Getal visueel dominant; icon ondersteunend of weggelaten.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

- Unit: placeholder-logic
- E2E: interaction-diversity, sorting-sequence
- Geen layout shift bij pointerdown

---

## 8. Security/Privacy Notes (Security/Privacy)

**N/A:** Geen nieuwe risks.

---

## 9. Slice Map (Orchestrator)

**Epic 35.1** — Bouw de Toren Finetune (5 verfijningen)
- **Milestone:** Layout stabiel; placeholder blijft; progress afzijdig; contrast OK; doelgetal verbeterd
- **Files:** TowerPuzzle.vue, MinigameBouwDeToren.vue
- **Acceptance:** Vijf issues opgelost; typecheck, build, E2E green
