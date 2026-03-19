# Epic 51 Design Bible — Remember Login by Default

> PlanRef (master): artifacts/archive/epic-51.0/latest  
> This is a living document.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience:** Ouders/verzorgers en kinderen die Rekenreis gebruiken.
- **Primary experience goal:** Login moet standaard onthouden worden — geen checkbox nodig; elke succesvolle login/registratie resulteert in een langlopende sessie.
- **"Looks/feels like" acceptance criteria:**
  - Na login of registratie blijft de gebruiker ingelogd, ook na het sluiten van de browser.
  - Geen "onthoud mij" checkbox op de loginpagina.
- **Non-goals:** Optioneel uitschakelen van remember; extra UI-elementen.

## 2. Visual Direction (Art Director)

N/A: Geen visuele wijzigingen. Loginpagina blijft gelijk; checkbox wordt niet toegevoegd.

## 3. UX Layout & Components (UX Designer)

- **Primary screens impacted:** Geen wijziging aan UI. Login-/registratieformulieren ongewijzigd.
- **Impact:** Backend-wijziging alleen; gebruikerservaring verbetert door langere sessiepersistentie.

## 4. Motion & Audio Rules (Motion/Audio)

N/A: Geen wijzigingen.

## 5. Accessibility (UX + QA)

N/A: Geen wijzigingen aan bestaande accessibility.

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

- **Laravel Auth:** `Auth::attempt($credentials, true)` en `Auth::login($user, true)` — tweede parameter `true` activeert "remember me".
- **Remember token:** Laravel gebruikt `users.remember_token` en een langlopende cookie (`remember_web_*`) voor automatische her-inlog na sessieverval.
- **Files:** `apps/api/app/Http/Controllers/AuthController.php` — login (regel 36) en register (regel 84).
- **Geen API-contractwijziging:** Geen nieuwe parameters; frontend ongewijzigd.

## 7. Test Strategy & Regression Plan (QA Strategist)

- **Unit tests (API):** AuthTest — verifieer dat login/register met sessie een remember-token en/of remember-cookie zetten.
- **E2E:** Simuleer "remember" door auth flow → opslaan storage state → nieuw context met die state → navigeer naar /map; assert nog steeds ingelogd.
- **Non-flaky:** Gebruik bestaande auth-helper; geen extra wachttijden.

## 8. Security/Privacy Notes (Security/Privacy)

- **Risks:** Langere sessie = langere exposure bij device-verlies. Standaard gedrag voor kleuter-app is acceptabel (geen gevoelige data; kindvriendelijke UX).
- **Mitigations:** Laravel remember-token is hashed; cookie heeft lange maar eindige TTL (default 576000 min ≈ 1 jaar).
- **Geen nieuwe config:** Bestaande Sanctum/session config voldoende.

## 9. Slice Map (Orchestrator)

- **Epic 51.1** — Remember Login by Default + Tests
  - **Visual milestone:** Geen (backend-only; sessie persistieert langer).
  - **Files:** AuthController.php, AuthTest.php, auth-helper.spec.ts of e2e auth specs.
  - **Acceptance:** Login en register gebruiken remember=true; API-tests verifiëren; E2E simuleert persistentie.
