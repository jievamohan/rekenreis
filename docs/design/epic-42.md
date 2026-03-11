# Epic 42 Design Bible — L→R Fish Visibility Fix

> PlanRef (master): artifacts/archive/epic-42.0/latest  
> Fix: visjes die van links naar rechts zwemmen zijn niet zichtbaar.

---

## 1. Vision & Success Criteria (BA + Game Designer)
- Doel: L→R zwemmende visjes zijn zichtbaar in Fish Feed minigame
- Success: L→R en R→L visjes even goed zichtbaar
- Non-goals: nieuwe assets, andere minigames

## 2. Visual Direction (Art Director)
N/A: bugfix, geen visuele herdesign.

## 3. UX Layout & Components (UX Designer)
- Primary screen: /play (Fish Feed)
- Expectation: ambient fish in beide richtingen duidelijk zichtbaar

## 4. Motion & Audio Rules (Motion/Audio)
- Fix L→R animatie visibility
- Likely: positioning, overflow, transform order

## 5. Accessibility (UX + QA)
- Geen wijziging; reduced motion blijft fish uit

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)
- File: `apps/web/components/minigames/MinigameFishFeed.vue`
- L→R: left: -10%, swim-horizontal, translateX(0)→translateX(min(400px,120vw))
- R→L: right: -10%, swim-horizontal-rtl (werkt)
- Root-cause en fix in CSS/template

## 7. Test Strategy (QA Strategist)
- E2E: Fish Feed smoke groen
- Manual: L→R visjes zichtbaar op diverse viewports

## 8. Security/Privacy
- Geen nieuwe risico's

## 9. Slice Map (Orchestrator)
- Epic 42.1 — L→R Fish Visibility Fix
  - Visual milestone: L→R visjes zichtbaar
  - Files: MinigameFishFeed.vue
  - Acceptance: beide zwemrichtingen zichtbaar
