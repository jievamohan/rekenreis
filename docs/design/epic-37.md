# Epic 37 Design Bible — Zwemmende Vissen door Antwoordenblok

> PlanRef (master): artifacts/archive/epic-37.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)
- Target audience: Kleuters (4–7), Fish Feed minigame gebruikers
- Primary experience goal: Decoratieve vissen zwemmen door het antwoordenblok; underwater sfeer versterkt
- “Looks/feels like” acceptance criteria:
  - 2–5 vissen zichtbaar tegelijk
  - Richting: links→rechts en rechts→links (random)
  - Variatie: hoogte, snelheid, diepte (kleiner, waziger)
  - Vis verdwijnt uit DOM buiten viewable area
- Non-goals: Nieuwe gameplay, aanpasbare instellingen

## 2. Visual Direction (Art Director)
- Diepte-effect: Verder = kleiner + blur + lagere opacity
- Schaals: Voorgrond ~1.2–1.5em, achtergrond ~0.6–0.8em
- Kleuren: Bestaande vis-emoji (🐟) of vergelijkbaar
- Do: Subtiele, rustige beweging
- Don't: Afleidende bewegingen, pellets langdurig bedekken

## 3. UX Layout & Components (UX Designer)
- Fish-ambient-layer binnen aquarium, pointer-events: none
- Pellets blijven volledig klikbaar
- aria-hidden op vis-laag
- prefers-reduced-motion: vissen statisch of niet tonen

## 4. Motion & Audio Rules (Motion/Audio)
- Horizontale traversie: translateX, duur 8–20s per vis
- Richting: scaleX(-1) voor rechts→links
- Reduced motion: geen zwemmende vissen of statisch
- Sound: N/A

## 5. Accessibility (UX + QA)
- aria-hidden op decoratieve laag
- prefers-reduced-motion gerespecteerd

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)
- MinigameFishFeed.vue: fish-ambient-layer
- State: array van vis-objecten; IntersectionObserver of positie-check voor viewport exit
- Max 5 DOM nodes; pure CSS + minimale JS

## 7. Test Strategy & Regression Plan (QA Strategist)
- Unit: count 2–5, pellet click blijft werken
- E2E: Fish Feed smoke, antwoord geven

## 8. Security/Privacy Notes (Security/Privacy)
- Geen nieuwe risico’s; puur decoratief

## 9. Slice Map (Orchestrator)

- Epic 37.1 — Fish Pool + Direction + Height + Speed
  - Visual milestone: Vissen zwemmen horizontaal door aquarium
  - Files: MinigameFishFeed.vue
  - Acceptance: 2–5 vissen, L↔R, variabele y en snelheid

- Epic 37.2 — Depth + Viewport DOM Removal
  - Visual milestone: Diepte-effect (kleiner, waziger); vissen verdwijnen uit DOM
  - Files: MinigameFishFeed.vue
  - Acceptance: Scale/blur per laag, remove on exit

- Epic 37.3 — Polish + Reduced Motion + E2E
  - Visual milestone: Reduced-motion ok, count stabiel
  - Files: MinigameFishFeed.vue, e2e
  - Acceptance: prefers-reduced-motion, E2E green
