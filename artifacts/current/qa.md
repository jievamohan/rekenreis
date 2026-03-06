# QA — Treasure Dive Creatiever

**Run ID:** treasure-dive-creative-2025-03  
**Agent:** qa-strategist

## Test Strategie

### Unit
- MinigameTreasureDive: render, onAnswer correct/wrong, keyboard flow
- Geen nieuwe unit tests vereist als bestaande coverage voldoende

### E2E
- **mechanic-upgrades.spec.ts:** Treasure Dive (level 2/14) — drag en click-select + chest submit blijven werken
- **interaction-diversity.spec.ts:** treasure-dive nog steeds drag-drop proof
- Visual regression: screenshot van treasure-dive scene (indien baselines bestaan)

### Gates
- C: typecheck
- D: gitleaks, audit
- F: bundle budget

### Acceptance
- Drag correcte edelsteen naar kist → correct feedback, volgende ronde
- Click edelsteen + click kist → idem
- Keyboard: Tab → select → Enter on chest → idem
- Wrong drop → gentle feedback, retry mogelijk
- Reduced motion: geen storende animaties
- Geen regressie op andere minigames
