# Epic 47 Design Bible — Default Page: Map After Login

> PlanRef (master): artifacts/archive/epic-47.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience:** Ingelogde gebruikers (kinderen/ouders).
- **Primary experience goal:** Na inloggen of registratie landt de gebruiker direct op de kaart (level map), de centrale hub van het spel.
- **"Looks/feels like" acceptance criteria:**
  - Login success → redirect naar /map
  - Register success → redirect naar /map
  - Reeds ingelogd op /login of /register → redirect naar /map
- **Non-goals:** Auth flow wijzigen, API wijzigen, map pagina wijzigen.

## 2. Visual Direction (Art Director)

N/A: Geen visuele wijzigingen. Alleen redirect.

## 3. UX Layout & Components (UX Designer)

- **Primary screens impacted:** login.vue, register.vue; optioneel index.vue.
- **Navigation model:** Map wordt default landing na auth; geen wijziging aan shell of nav.
- **Tap targets & accessibility:** Geen impact.

## 4. Motion & Audio Rules (Motion/Audio)

N/A: Geen wijzigingen.

## 5. Accessibility (UX + QA)

Geen impact. Redirect is transparant.

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

- **Files:** apps/web/pages/login.vue, apps/web/pages/register.vue
- **Change:** `router.push('/')` en `router.replace('/')` → `/map`
- **Lane:** W1 (web pages)
- Geen API, middleware of composable wijzigingen.

## 7. Test Strategy & Regression Plan (QA Strategist)

- **E2E:** Verifieer dat post-login en post-register naar /map navigeren.
- **Smoke:** Geen regressie op bestaande auth flows.
- **Visual regression:** N/A.

## 8. Security/Privacy Notes (Security/Privacy)

Geen nieuwe risico's. Alleen redirect-bestemming.

## 9. Slice Map (Orchestrator)

- **Epic 47.1** — Post-Login Redirect to Map
  - **Visual milestone:** Na login/register landt gebruiker op /map.
  - **Files:** login.vue, register.vue; optioneel index.vue.
  - **Acceptance:** Login → /map; Register → /map; E2E green.
