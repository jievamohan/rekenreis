# Epic 40 Design Bible — Fish Direction Fix

> Bugfix: ambient fish face wrong direction (zwemmen achteruit).

---

## 1. Vision & Success Criteria
- Visjes moeten van links naar rechts én van rechts naar links zwemmen
- Visjes moeten de juiste kant op kijken (geen achteruit zwemmen)

## 6. Technical Implementation
- L→R: start left, move right. Fish moet naar rechts kijken.
- R→L: start right, move left. Fish moet naar links kijken.
- De 🐟 emoji kan per platform links of rechts kijken. Fix: flip de juiste groep zodat zwemrichting = kijkrichting.

## 9. Slice Map
- Epic 40.1 — Fish direction fix
  - Visual: Alle vissen kijken in zwemrichting
  - Acceptance: L→R en R→L correct, geen achteruit
