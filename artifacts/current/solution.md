# Solution — Treasure Dive Creatiever

**Run ID:** treasure-dive-creative-2025-03  
**Agent:** solution-designer

## Aanpak

Enhancement van `MinigameTreasureDive.vue` met:
1. **Visuele versterking** — kist en edelstenen meer "onderwater"
2. **Animatie-feedback** — correct: kist opent, gloed; wrong: edelsteen springt terug, kist schudt
3. **Drag-first affordance** — cursor grab/grabbing; edelsteen schaal bij drag; kist highlight bij drag-over
4. **Float-effect** — edelstenen subtiele CSS animatie (zweven); kist op bodem-strook

## Technische details

- **Component:** MinigameTreasureDive.vue
- **Styling:** Scoped CSS; keyframes voor chest-open, wrong-bounce, float
- **State:** Bestaande refs (draggedGem, selectedGem, chestHighlight) uitbreiden indien nodig
- **A11y:** Geen wijziging in ARIA/keyboard flow; reduced motion: animaties → `animation: none` of `transition: none`
- **Assets:** Alleen CSS; geen nieuwe SVGs als niet strikt noodzakelijk (budget < 2KB per minigame)

## Ops/config

N/A — geen configuratie of env wijzigingen.
