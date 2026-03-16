# Epic 48 Design Bible — Play URL Simplification

> PlanRef (master): artifacts/archive/epic-48.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)
- Target audience: Kleuters, ouders, ontwikkelaars die URLs delen/debuggen
- Primary experience goal: Alleen `level` in play-URL; mode/skin/source uit preferences
- "Looks/feels like" acceptance criteria: URL = `/play?level=5` of `/play`; geen mode/skin/source
- Non-goals: Wijziging map-navigatie, profiel-opslag, backend/API

## 2. Visual Direction (Art Director)
N/A: Geen visuele wijzigingen. Impact: none. Checks: no.

## 3. UX Layout & Components (UX Designer)
- Primary screens impacted: play.vue
- Navigation model: map→play: `/play?level=N`; binnen play: alleen level in query
- Mode/skin switcher: setPreferences, geen URL-update

## 4. Motion & Audio Rules (Motion/Audio)
N/A: Impact: none. Checks: no.

## 5. Accessibility (UX + QA)
Geen wijziging.

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)
- effectiveModeParam: altijd lastMode (niet route.query.mode)
- effectiveSkinId: altijd lastSkin (niet route.query.skin)
- playSource: levelParam !== null ? 'pack' : 'infinite'
- selectSkin: setPreferences, geen router.push met skin
- onModeSelectorSelect: setPreferences, router.push alleen level
- Verwijder onMounted router.replace die mode/skin sync

## 7. Test Strategy & Regression Plan (QA Strategist)
- E2E: bestaande tests blijven green; voeg URL-assertie toe na mode/skin switch

## 8. Security/Privacy Notes (Security/Privacy)
Geen nieuwe risico's; minder info in URL.

## 9. Slice Map (Orchestrator)

- Epic 48.1 — Play URL: Alleen Level Parameter
  - Visual milestone: URL toont alleen level (of leeg)
  - Files/modules: apps/web/pages/play.vue
  - Acceptance: /play?level=5 of /play; mode/skin uit preferences; E2E green
