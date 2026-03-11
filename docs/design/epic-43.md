# Epic 43 Design Bible — Result Screen Score Fix

> PlanRef (master): artifacts/archive/epic-43.0/latest  
> Fix: timeout mag niet als correct tellen; 0 antwoorden = 0/10.

---

## 1. Vision & Success Criteria
- Resultaat scherm toont correcte score
- Timeout = fout (geen punt)
- E2E: spel door zonder antwoord → 0 van 10

## 2. Visual Direction
N/A: bugfix

## 3. UX Layout & Components
- Level complete modal: correctCount en roundsTotal kloppen

## 4. Motion & Audio
N/A

## 5. Accessibility
Geen wijziging

## 6. Technical Implementation
- Fish Feed, Bubble Pop, Memory Match: onTimeout emit wrong choice i.p.v. correctAnswer
- Wrong: question.choices.find(c => c !== correctAnswer) ?? -1
- E2E: profile met timersDisabled, speel 10 rondes zonder te klikken, assert "0" en "10" in modal

## 7. Test Strategy
- E2E: result-score-zero.spec.ts
- Bestaande minigame tests groen

## 8. Security/Privacy
Geen

## 9. Slice Map
- Epic 43.1 — Timeout telt als fout (3 minigames)
- Epic 43.2 — E2E 0/10 zonder antwoorden
