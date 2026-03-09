# Epic 31 Design Bible — Map Polish & 200 Levels

> PlanRef (master): artifacts/archive/epic-31.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Kleuters (4–6 jaar), Dutch-speaking.

**Primary experience goal:** Map verbeteren: grotere avatar, sterren boven de cirkel met placeholders, levelnummer altijd in de cirkel, en 200 levels voor een langere leerroute.

**"Looks/feels like" acceptance criteria:**
1. Avatar op de map is duidelijk groter dan de level-cirkels
2. Sterren staan altijd boven de cirkel; lege placeholders bij 0 sterren (geen layout-sprong)
3. Elke level-cirkel toont het levelnummer binnenin
4. Map toont 200 levels; play ondersteunt tot level 200

**Non-goals:** Nieuwe minigames, star-scoring logica, avatar-expressies.

---

## 2. Visual Direction (Art Director)

**Theme directive:** Behoud bestaande map-stijl; alleen formaat en layout aanpassingen.

**Avatar size:** 40px → ~96px (of 80–100px). Duidelijk groter dan 56px node-cirkels.

**Stars above circle:** Filled star #ffc107; empty placeholder: zelfde afmeting, outline, opacity ~0.3. Vaste hoogte voor de sterren-rij.

**Level number:** Altijd in de cirkel; leesbaar op completed (groen) en current (primary border). Iets kleiner lettertype voor 3 cijfers (100–200).

**Do:** Consistente ster-slotgrootte; geen layout shift.  
**Don't:** Pad-stijl of achtergronddecoratie wijzigen in deze epic.

---

## 3. UX Layout & Components (UX Designer)

**Primary screens impacted:** /map

**Component catalog:**
- MapNode: sterren boven cirkel, 3-slot placeholder, levelnummer altijd in cirkel
- MapAvatar: groter formaat (~96px)
- map.vue: avatarStyle offset aanpassen

**Layout:** Node 56×56px; sterren-rij erboven (~20px hoog); avatar ~96px. Tap targets ≥ 44px.

**Accessibility:** Aria-labels behouden (level + sterren + locked). Sterren decoratief (aria-hidden). Focusvolgorde: nodes in volgorde.

---

## 4. Motion & Audio Rules (Motion/Audio)

**N/A:** Geen nieuwe animaties of geluiden. Bestaande avatar-bounce en node-pulse blijven. Reduced motion ongewijzigd.

---

## 5. Accessibility (UX + QA)

**Keyboard model:** Nodes blijft tab-navigeerbaar.  
**Focus states:** Unchanged.  
**Contrast:** Levelnummer leesbaar op alle node-states.  
**Screen reader:** Aria-labels voor level, sterren, locked.

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Files:**
- MapNode.vue — stars above, placeholder, number in circle
- MapAvatar.vue — grotere bubble; MaatjeAvatar size
- MaatjeAvatar.vue — optioneel size="xl"
- map.vue — avatarStyle top offset
- levels.classic.v1.json — 200 entries
- generate-levels.mjs — uitbreiden voor 200

**Data flow:** totalLevels = levelsData.length; waypoints schaalt automatisch.

**Constraints:** Bundle size (200 level-objecten); map scroll performance.

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Unit:** levelValidator voor 200-level pack.  
**E2E:** Map smoke; scroll-to-current met 200 levels.  
**Non-flaky:** Text content, aria-labels, counts.  
**Visual:** Map met 0/1/2/3 sterren; grotere avatar.

---

## 8. Security/Privacy Notes (Security/Privacy)

**N/A:** Geen nieuwe security- of privacy-surface.

---

## 9. Slice Map (Orchestrator)

### Epic 31.1 — Level Content: 200 Levels
- **Visual milestone:** Map toont 200 level-nodes; play accepteert level 1–200
- **Files:** levels.classic.v1.json, generate-levels.mjs
- **Acceptance:** 200 levels; schema geldig; map + play werken

### Epic 31.2 — MapNode: Stars Above, Placeholders, Number in Circle
- **Visual milestone:** Sterren boven cirkel; placeholders bij 0; nummer altijd in cirkel
- **Files:** MapNode.vue
- **Acceptance:** Geen layout jump; alle states correct

### Epic 31.3 — MapAvatar: Much Larger
- **Visual milestone:** Avatar duidelijk groter dan level-cirkels
- **Files:** MapAvatar.vue, MaatjeAvatar.vue, map.vue
- **Acceptance:** Avatar ~96px; correct gepositioneerd

### Epic 31.4 — Polish & E2E
- **Visual milestone:** Geen regressies; E2E groen
- **Files:** e2e tests, typecheck, bundle budget
- **Acceptance:** E2E green; typecheck; Gate F
