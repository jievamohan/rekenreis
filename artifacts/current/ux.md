# UX — Treasure Dive Creatiever

**Run ID:** treasure-dive-creative-2025-03  
**Agent:** ux-designer

## Current Flow

1. ProblemCard toont som (bijv. 3 + 5)
2. Edelstenen in source-zone; kist als drop-target
3. Speler: drag gem → chest OF click gem → click chest
4. Feedback: correct/wrong → volgende ronde

## Pain Points

- **Geen visueel onderscheid:** Statische layout; kist en edelstenen lijken op "gewone knoppen"
- **Drag niet prominent:** Click-flow is sneller, dus dominant; drag voelt als optioneel
- **Geen narratief gevoel:** Ontbreekt "duik naar schat"-beleving

## Proposed UX Shifts

1. **Drag-first affordance:** Edelstenen duidelijk als "sleepbare" objecten; visuele hint dat ze naar de kist moeten
2. **Kist als doel:** Kist meer centraal; open/dicht animatie bij correcte drop; subtiele gloed als hover/drag-over
3. **Water-context:** Edelstenen zweven/bewegen licht; kist op zeebodem-zone
4. **Feedback op wrong:** Edelsteen "stuitert terug" of kist "schudt"; geen straf, wel duidelijk "probeer opnieuw"
5. **Keyboard:** Huidige Tab + select + chest Enter blijft; geen degradatie

## Layout

- Source-zone bovenaan; kist groter/midden; pijl of visuele flow ernaartoe
- Tap targets ≥ 48px
- Reduced motion: animaties vervallen naar instant state change
