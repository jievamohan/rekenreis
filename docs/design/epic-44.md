# Epic 44 Design Bible — Bouw de Toren Progress Responsive

> PlanRef (master): artifacts/archive/epic-44.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience:** Kleuters/kinderen die Bouw de Toren spelen op tablet en telefoon.
- **Primary experience goal:** De gehele progress (alle torens) is altijd zichtbaar op elk schermformaat.
- **"Looks/feels like" acceptance criteria:**
  - Geen horizontale overflow van progress-torens.
  - Volledige progress zichtbaar op 320px–1920px viewport.
  - Alternatieve implementatie op telefoon toegestaan indien nodig.
- **Non-goals:** Wijziging aan gameplay, andere minigames, of level-config.

## 2. Visual Direction (Art Director)

N/A: Geen visuele stijlwijzigingen. Progress-torens blijven herkenbaar (completed/active/inactive states).

## 3. UX Layout & Components (UX Designer)

- **Primary screens impacted:** `/play` — Bouw de Toren minigame (TowerPuzzle).
- **Component:** `.towers-progress` — responsive layout met scaling en/of wrap.
- **Breakpoints:** Desktop (≥768px), tablet (480–768px), phone (≤480px).
- **Tap targets & accessibility:** Behouden aria-labels; iconen niet te klein (<24px effectief).

## 4. Motion & Audio Rules (Motion/Audio)

N/A: Geen wijzigingen.

## 5. Accessibility (UX + QA)

- **Screen reader:** Bestaande aria-labels behouden.

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

- **Where:** `apps/web/components/minigames/bouw-de-toren/TowerPuzzle.vue`
- **Approach:** CSS-only — flex-wrap, responsive gap, icon size via clamp/media queries.
- **Optional:** Compacte weergave (dots of "X van Y") op zeer smalle viewports.

## 7. Test Strategy & Regression Plan (QA Strategist)

- **Unit tests:** Geen nieuwe (puur CSS).
- **E2E:** Bestaande bouw-de-toren specs moeten groen blijven.
- **Optional:** Viewport-resize test op 375px en 768px.

## 8. Security/Privacy Notes (Security/Privacy)

N/A: Geen risico's.

## 9. Slice Map (Orchestrator)

- **Epic 44.1** — Responsive progress towers
  - **Visual milestone:** Progress-torens zichtbaar binnen viewport op tablet en telefoon.
  - **Files:** `TowerPuzzle.vue`
  - **Acceptance:** Geen overflow; volledige progress zichtbaar op 320px–1920px; Gate C, D, F green.
