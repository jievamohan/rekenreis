# QA — Fish Feed Creatiever

**Run ID:** fish-feed-creative-2025-03  
**Agent:** qa-strategist

## Teststrategie

### Unit
- Geen nieuwe unit tests; bestaande minigame flow blijft

### E2E
- Bestaande interaction-diversity.spec.ts: "timed-kind (FishFeed): timeout shows hint and continues"
- Mechanic-upgrades.spec.ts: FishFeed flow
- **Verificatie:** E2E moet blijven slagen na layout- en visuele wijzigingen

### Handmatig
- Tap correct → feedback correct
- Tap wrong → retry mogelijk
- Timeout → hint + continue
- Reduced motion → geen storende animaties
- Keyboard → Tab + Enter werkt

### Gates
- C: typecheck
- D: security
- F: build + bundle budget
