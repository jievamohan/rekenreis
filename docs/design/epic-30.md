# Epic 30 Design Bible — Avatars & Expressions (Maatjes)

> PlanRef (master): artifacts/archive/epic-30.0/latest
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

**Target audience:** Kleuters (4–6 jaar), Dutch-speaking.

**Primary experience goal:** Maatjes (avatar-karakters) uit temp_assets/maatjes worden geïntegreerd en tonen de juiste expressie op het juiste moment (scores, introductie, map). Kind krijgt emotionele feedback via vriendelijke mascottes.

**"Looks/feels like" acceptance criteria:**
1. Avatar-matrix gedocumenteerd (character × expression)
2. Avatars gekopieerd naar assets/graphics/characters/maatjes/
3. Avatars verschijnen op: map, level complete (score-afhankelijke expressie), mistakes review, introductie
4. Expressie past bij context (Feest bij 3★, Blij bij 2★, Neutraal bij 1★, Verdrietig bij 0★, Nadenken bij mistakes)

**Non-goals:** Nieuwe minigames, backend, cloud sync.

---

## 2. Visual Direction (Art Director)

**Theme directive:** Behoud onderwater/kindvriendelijke stijl. Maatjes zijn bestaande PNG-assets.

**Asset specifics:** temp_assets/maatjes → assets/graphics/characters/maatjes/; kebab-case mappen (een-oog-eerlijk, slimme-rekenaar).

**Sizing:** Map 40×40px, LevelComplete 80×80px, MistakesReview 64×64px, Profile 48×48px. object-fit: contain.

**Do:** Expressie past bij context; fallback wolkje of eerste beschikbare maatje.

**Don't:** Geen stretch; graceful fallback als asset ontbreekt.

---

## 3. UX Layout & Components (UX Designer)

**Primary screens impacted:** /map, LevelCompleteModal, MistakesReview, /start of index, ProfileSelector.

**Expression mapping:**
| Context | Expressie |
|---------|-----------|
| Map | Blij |
| Level complete 3★ | Feest |
| Level complete 2★ | Blij |
| Level complete 1★ | Neutraal |
| Level complete 0★ | Verdrietig |
| Mistakes review | Nadenken |
| Introductie | Neutraal of Blij |

**Component catalog:** MaatjeAvatar.vue, useMaatje composable, maatje-matrix config. MapAvatar, LevelCompleteModal, MistakesReview gebruiken MaatjeAvatar.

**Tap targets:** Avatars decoratief; aria-hidden of role="img" met aria-label.

---

## 4. Motion & Audio Rules (Motion/Audio)

**Animations:** MapAvatar bounce behouden; reduced motion: uit.

**Sound:** N/A.

---

## 5. Accessibility (UX + QA)

Avatars decoratief; aria-hidden of role="img" met aria-label. Geen nieuwe interactieve elementen.

---

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

**Asset pipeline:** Copy script; normaliseer "een-oog eerlijk" → "een-oog-eerlijk".

**Data model:** MaatjeId, ExpressionId; matrix Record<MaatjeId, Partial<Record<ExpressionId, string>>>. Fallback: expression → blij → neutraal.

**Component structure:** components/characters/MaatjeAvatar.vue, composables/useMaatje.ts, types/maatje.ts, content/maatje-matrix.ts.

**Performance:** Lazy-load per context; bundle budget (Gate F).

---

## 7. Test Strategy & Regression Plan (QA Strategist)

**Unit:** useMaatje resolve + fallback; MaatjeAvatar render.

**E2E:** Map avatar visible; level complete maatje; mistakes review maatje.

**Visual:** Screenshot baselines voor map, level complete, mistakes review.

---

## 8. Security/Privacy Notes (Security/Privacy)

Geen nieuwe risico's. Assets lokaal; geen PII.

---

## 9. Slice Map (Orchestrator)

### Epic 30.1 — Asset Pipeline + Matrix + MaatjeAvatar
- **Visual milestone:** Geen (infra)
- **Tasks (≤5):** (1) Copy script + assets naar assets/graphics/characters/maatjes; (2) types/maatje.ts + maatje-matrix + useMaatje; (3) MaatjeAvatar.vue; (4) Unit tests
- **Files:** scripts/, types/maatje.ts, composables/useMaatje.ts, components/characters/MaatjeAvatar.vue
- **Acceptance:** Assets op juiste plek; matrix compleet; MaatjeAvatar rendert; unit tests pass

### Epic 30.2 — Map + Level Complete Integration
- **Visual milestone:** Map toont maatje; level complete toont maatje met juiste expressie
- **Tasks (≤5):** (1) MapAvatar: MaatjeAvatar i.p.v. emoji; (2) LevelCompleteModal: MaatjeAvatar met expressie uit stars; (3) Fallback bij ontbrekende asset; (4) E2E map + level complete
- **Files:** MapAvatar.vue, LevelCompleteModal.vue
- **Acceptance:** Map en level complete tonen maatje; expressie correct; E2E groen

### Epic 30.3 — Mistakes Review + Introductie
- **Visual milestone:** Mistakes review en start tonen maatje
- **Tasks (≤5):** (1) MistakesReview: MaatjeAvatar (nadenken); (2) Start/index: maatje (neutraal/blij); (3) nl.json aria-labels; (4) E2E
- **Files:** MistakesReview.vue, start.vue, index.vue
- **Acceptance:** Mistakes review en start tonen maatje; E2E groen

### Epic 30.4 — Profile Maatje Selection (Optional)
- **Visual milestone:** Profile-keuze toont maatje-karakters
- **Tasks (≤5):** (1) ProfileSchema: maatjeId of avatarId→maatje mapping; (2) ProfileCreate: maatje-keuze; (3) ProfileSelector: maatje-thumbnail; (4) Migration default wolkje; (5) E2E
- **Files:** profileSchema.ts, ProfileCreate.vue, ProfileSelector.vue
- **Acceptance:** Profiel kan maatje kiezen; map/level complete toont gekozen maatje

### Epic 30.5 — Polish + Bundle Budget
- **Visual milestone:** Geen regressie
- **Tasks (≤5):** (1) Bundle budget check; (2) Visual regression baselines; (3) Reduced motion; (4) Final E2E
- **Acceptance:** Gate F passes; visual baselines; reduced motion; E2E groen
